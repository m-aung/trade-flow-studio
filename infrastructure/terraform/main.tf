provider "aws" {
  region = "us-west-2"  # or your preferred region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "tradeflow-vpc"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier        = "tradeflow-db"
  engine           = "postgres"
  engine_version   = "14"
  instance_class   = "db.t3.micro"
  allocated_storage = 20
  
  username         = "postgres"
  password         = "your_password_here"  # Use AWS Secrets Manager in production
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  skip_final_snapshot = true
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  bucket = "tradeflow-static-assets"
}

# ECR Repository
resource "aws_ecr_repository" "app" {
  name = "tradeflow-app"
} 