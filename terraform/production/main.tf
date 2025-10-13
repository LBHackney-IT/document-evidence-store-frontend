provider "aws" {
  region  = "eu-west-2"
  version = "~> 3.0"
}
data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_vpc" "dr_vpc" {
  tags = {
    Name = "disaster-recovery-prod"
  }
}

terraform {
  backend "s3" {
    bucket  = "terraform-state-disaster-recovery"
    encrypt = true
    region  = "eu-west-2"
    key     = "services/des/state"
  }
}

resource "aws_security_group" "frontend_traffic" {
  vpc_id      = data.aws_vpc.dr_vpc.id
  name_prefix = "allow_frontend_traffic"

  egress {
    description = "allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}