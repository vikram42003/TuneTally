terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "5.87.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
  shared_credentials_files = "~/.aws/credentials"
}