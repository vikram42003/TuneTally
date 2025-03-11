terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                   = "ap-south-1"
  shared_credentials_files = ["~/.aws/credentials"]
}

resource "aws_dynamodb_table" "state_verifier_pair" {
  name           = "state_verifier_pair"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5

  hash_key = "State"

  attribute {
    name = "State"
    type = "S"
  }

  ttl {
    attribute_name = "Ttl"
    enabled        = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}
