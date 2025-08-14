resource "aws_dynamodb_table" "sessionID_token_pair" {
  name           = "sessionID_token_pair"
  billing_mode   = "PAY_PER_REQUEST"

  hash_key = "sessionID"

  attribute {
    name = "sessionID"
    type = "S"
  }

  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  lifecycle {
    prevent_destroy = false
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}