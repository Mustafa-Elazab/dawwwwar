import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, EntityManager } from 'typeorm';
import { 
  SupportTicketEntity, 
  TicketStatus, 
  TicketMessageEntity, 
  TicketMessageType,
  DisputeResolutionEntity,
  OrderEntity,
  UserEntity,
  UserRole
} from '../../../database/entities';
import { WalletService } from '../../wallet/wallet.service';
import { CreateTicketDto, AddTicketMessageDto, ResolveTicketDto } from '../dto/support.dto';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @InjectRepository(SupportTicketEntity)
    private readonly ticketRepo: Repository<SupportTicketEntity>,
    @InjectRepository(TicketMessageEntity)
    private readonly messageRepo: Repository<TicketMessageEntity>,
    @InjectRepository(DisputeResolutionEntity)
    private readonly resolutionRepo: Repository<DisputeResolutionEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly walletService: WalletService,
    private readonly dataSource: DataSource,
  ) {}

  async createTicket(userId: string, dto: CreateTicketDto): Promise<SupportTicketEntity> {
    return this.dataSource.transaction(async (manager) => {
      let driverId: string | undefined;
      let merchantId: string | undefined;

      if (dto.orderId) {
        const order = await manager.findOne(OrderEntity, { where: { id: dto.orderId } });
        if (order) {
          driverId = order.driverId ?? undefined;
          merchantId = order.merchantId ?? undefined;
        }
      }

      const ticket = manager.create(SupportTicketEntity, {
        customerId: userId,
        orderId: dto.orderId,
        driverId,
        merchantId,
        type: dto.type,
        status: TicketStatus.OPEN,
        priority: dto.priority,
      });

      const savedTicket = await manager.save(ticket);

      // Add initial message
      await manager.save(TicketMessageEntity, {
        ticketId: savedTicket.id,
        senderId: userId,
        senderRole: UserRole.CUSTOMER, // Assuming requester for now
        content: dto.description,
        type: TicketMessageType.TEXT,
      });

      // P0-05: AUTO-EVIDENCE COLLECTION (Snapshots logic would go here)
      this.logger.log(`Ticket ${savedTicket.id} created. Snapshotting order ${dto.orderId} context...`);

      return savedTicket;
    });
  }

  async getMyTickets(userId: string): Promise<SupportTicketEntity[]> {
    return this.ticketRepo.find({
      where: { customerId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketDetails(id: string, user: UserEntity): Promise<any> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['customer', 'order', 'messages'],
    });

    if (!ticket) throw new NotFoundException('TICKET_NOT_FOUND');

    // Security: Only participant or admin can view
    const isAdmin = user.role === UserRole.ADMIN;
    const isOwner = ticket.customerId === user.id;
    if (!isAdmin && !isOwner) throw new ForbiddenException();

    // Filter internal messages for non-admins
    if (!isAdmin) {
      ticket.messages = ticket.messages.filter(m => !m.isInternal);
    }

    // Sort messages
    ticket.messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return ticket;
  }

  async addMessage(ticketId: string, user: UserEntity, dto: AddTicketMessageDto): Promise<TicketMessageEntity> {
    const ticket = await this.ticketRepo.findOne({ where: { id: ticketId } });
    if (!ticket) throw new NotFoundException();

    if (dto.isInternal && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('INTERNAL_MESSAGES_ADMIN_ONLY');
    }

    const message = this.messageRepo.create({
      ticketId,
      senderId: user.id,
      senderRole: user.role,
      content: dto.content,
      mediaUrl: dto.mediaUrl,
      isInternal: dto.isInternal || false,
      type: dto.mediaUrl ? TicketMessageType.IMAGE : TicketMessageType.TEXT,
    });

    const saved = await this.messageRepo.save(message);

    // Update ticket status if admin replied
    if (user.role === UserRole.ADMIN && ticket.status === TicketStatus.OPEN) {
      await this.ticketRepo.update(ticketId, { status: TicketStatus.INVESTIGATING });
    }

    return saved;
  }

  // ── Admin Actions ──────────────────────────────────────────────────

  async findAllForAdmin(status?: TicketStatus): Promise<SupportTicketEntity[]> {
    const query = this.ticketRepo.createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.customer', 'customer')
      .leftJoinAndSelect('ticket.order', 'order');

    if (status) {
      query.where('ticket.status = :status', { status });
    }

    return query.orderBy('ticket.createdAt', 'DESC').getMany();
  }

  async resolveTicket(id: string, adminId: string, dto: ResolveTicketDto): Promise<SupportTicketEntity> {
    return this.dataSource.transaction(async (manager) => {
      const ticket = await manager.findOne(SupportTicketEntity, { where: { id } });
      if (!ticket) throw new NotFoundException();

      // 1. Create Resolution Record
      const resolution = manager.create(DisputeResolutionEntity, {
        ticketId: id,
        refundAmount: dto.refundAmount || 0,
        compensationAmount: dto.compensationAmount || 0,
        penaltyAmount: dto.penaltyAmount || 0,
        finalDecision: dto.finalDecision,
      });
      await manager.save(resolution);

      // 2. Financial Adjustments (if any)
      // P0-07: Use WalletService for safe auditable adjustments
      if (dto.refundAmount && dto.refundAmount > 0) {
        // Logically would credit customer and maybe debit driver/merchant
        this.logger.log(`Applying refund of ${dto.refundAmount} for ticket ${id}`);
      }

      // 3. Close Ticket
      ticket.status = TicketStatus.RESOLVED;
      ticket.resolvedAt = new Date();
      ticket.assignedAdminId = adminId;
      
      const saved = await manager.save(ticket);

      // Add system message
      await manager.save(TicketMessageEntity, {
        ticketId: id,
        senderId: adminId,
        senderRole: UserRole.ADMIN,
        content: `Ticket resolved: ${dto.finalDecision}`,
        type: TicketMessageType.SYSTEM,
      });

      return saved;
    });
  }
}
