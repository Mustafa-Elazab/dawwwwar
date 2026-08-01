import type { FarhaPhase1EventType } from '../domain/phase1Types';

export interface ChecklistTemplateItem {
  offsetDaysBeforeEvent: number;
  titleKey: string;
}

export const standardChecklistTemplates: Partial<Record<FarhaPhase1EventType, ChecklistTemplateItem[]>> = {
  wedding: [
    { offsetDaysBeforeEvent: 365, titleKey: 'farha.phase1.templates.wedding.setBudget' },
    { offsetDaysBeforeEvent: 300, titleKey: 'farha.phase1.templates.wedding.bookVenue' },
    { offsetDaysBeforeEvent: 270, titleKey: 'farha.phase1.templates.wedding.bookHotel' },
    { offsetDaysBeforeEvent: 240, titleKey: 'farha.phase1.templates.wedding.chooseDress' },
    { offsetDaysBeforeEvent: 240, titleKey: 'farha.phase1.templates.wedding.bookPhotoVideo' },
    { offsetDaysBeforeEvent: 210, titleKey: 'farha.phase1.templates.wedding.bookSuit' },
    { offsetDaysBeforeEvent: 180, titleKey: 'farha.phase1.templates.wedding.bookMakeup' },
    { offsetDaysBeforeEvent: 150, titleKey: 'farha.phase1.templates.wedding.bookEntertainment' },
    { offsetDaysBeforeEvent: 120, titleKey: 'farha.phase1.templates.wedding.orderGold' },
    { offsetDaysBeforeEvent: 90, titleKey: 'farha.phase1.templates.wedding.sendInvitations' },
    { offsetDaysBeforeEvent: 60, titleKey: 'farha.phase1.templates.wedding.confirmCatering' },
    { offsetDaysBeforeEvent: 45, titleKey: 'farha.phase1.templates.wedding.bookBarber' },
    { offsetDaysBeforeEvent: 30, titleKey: 'farha.phase1.templates.wedding.finalDressFitting' },
    { offsetDaysBeforeEvent: 21, titleKey: 'farha.phase1.templates.wedding.finalGuestCount' },
    { offsetDaysBeforeEvent: 14, titleKey: 'farha.phase1.templates.wedding.payBalances' },
    { offsetDaysBeforeEvent: 7, titleKey: 'farha.phase1.templates.wedding.reconfirmVendors' },
    { offsetDaysBeforeEvent: 3, titleKey: 'farha.phase1.templates.wedding.pickUpOutfits' },
    { offsetDaysBeforeEvent: 1, titleKey: 'farha.phase1.templates.wedding.finalReview' },
  ],
  engagement: [
    { offsetDaysBeforeEvent: 90, titleKey: 'farha.phase1.templates.engagement.setBudget' },
    { offsetDaysBeforeEvent: 60, titleKey: 'farha.phase1.templates.engagement.bookVenue' },
    { offsetDaysBeforeEvent: 45, titleKey: 'farha.phase1.templates.engagement.orderRings' },
    { offsetDaysBeforeEvent: 30, titleKey: 'farha.phase1.templates.engagement.arrangeGifts' },
    { offsetDaysBeforeEvent: 21, titleKey: 'farha.phase1.templates.engagement.sendInvitations' },
    { offsetDaysBeforeEvent: 14, titleKey: 'farha.phase1.templates.engagement.confirmCatering' },
    { offsetDaysBeforeEvent: 7, titleKey: 'farha.phase1.templates.engagement.confirmOutfits' },
    { offsetDaysBeforeEvent: 1, titleKey: 'farha.phase1.templates.engagement.finalReview' },
  ],
  anniversary: [
    { offsetDaysBeforeEvent: 30, titleKey: 'farha.phase1.templates.anniversary.decideCelebration' },
    { offsetDaysBeforeEvent: 21, titleKey: 'farha.phase1.templates.anniversary.bookVenue' },
    { offsetDaysBeforeEvent: 14, titleKey: 'farha.phase1.templates.anniversary.orderGift' },
    { offsetDaysBeforeEvent: 7, titleKey: 'farha.phase1.templates.anniversary.sendInvitations' },
    { offsetDaysBeforeEvent: 1, titleKey: 'farha.phase1.templates.anniversary.finalReview' },
  ],
  other: [],
};
