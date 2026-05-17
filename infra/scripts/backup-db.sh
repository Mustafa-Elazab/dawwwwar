#!/bin/bash

# Database Backup Script
# Usage: ./backup-db.sh <db_name> <db_user> <db_password> <r2_bucket_path>

DB_NAME=${1:-dawwar_db}
DB_USER=${2:-dawwar}
DB_PASSWORD=${3}
BACKUP_DIR="/tmp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p $BACKUP_DIR

echo "Starting backup for $DB_NAME..."

# Run pg_dump
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "Backup successful: ${BACKUP_FILE}"
  
  # Here you would typically upload to Cloudflare R2 or S3
  # rclone copy "${BACKUP_DIR}/${BACKUP_FILE}" r2:dawwar-backups/
  
  # Remove old backups (keep last 7 days locally)
  find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
else
  echo "Backup failed!"
  exit 1
fi
