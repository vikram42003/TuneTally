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

# DYNAMO DB

resource "aws_dynamodb_table" "sessionID_token_pair" {
  name           = "sessionID_token_pair"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5

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
    prevent_destroy = true
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

resource "aws_iam_policy" "lambda_dynamodb_access" {
  name = "lambda_dynamodb_access"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Resource = aws_dynamodb_table.sessionID_token_pair.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_dynamodb_access.arn
}

# LAMBDA FUNCTION

resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/python/lambdaFunction.py"
  output_path = "lambda_function_payload.zip"
}

resource "aws_lambda_function" "TuneTally_Lambda_Func" {
  depends_on    = [data.archive_file.lambda]
  filename      = "lambda_function_payload.zip"
  function_name = "TuneTally_Lambda_Func"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "lambdaFunction.lambda_handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "python3.13"

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

# API GATEWAY

resource "aws_lambda_permission" "Allow_TuneTally_Lambda_Func" {
  statement_id  = "AllowTuneTally_API_GatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Lambda_Func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/POST/authenticate"
}

resource "aws_api_gateway_rest_api" "TuneTally_API_Gateway" {
  name = "TuneTally_API_Gateway"

  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "TuneTally_API_Gateway"
      version = "1.0"
    }
    paths = {
      "/authenticate" = {
        post = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Lambda_Func.invoke_arn
          }
        }
        # https://docs.aws.amazon.com/apigateway/latest/developerguide/enable-cors-for-resource-using-swagger-importer-tool.html
        options = {
          responses = {
            "200" = {
              description = "Default response for CORS method"
              headers = {
                Access-Control-Allow-Headers = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Origin = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Methods = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            type                 = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type'"
                  "method.response.header.Access-Control-Allow-Methods" = "'POST,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Origin"  = "'http://localhost:5173'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
        }
      }
    }
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

resource "aws_api_gateway_deployment" "TuneTally_API_Gateway_Deployment" {
  rest_api_id = aws_api_gateway_rest_api.TuneTally_API_Gateway.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.TuneTally_API_Gateway.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "example" {
  deployment_id = aws_api_gateway_deployment.TuneTally_API_Gateway_Deployment.id
  rest_api_id   = aws_api_gateway_rest_api.TuneTally_API_Gateway.id
  stage_name    = "v1"
}