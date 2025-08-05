resource "aws_lambda_permission" "Allow_TuneTally_Authorizarion_Lambda" {
  statement_id  = "AllowTuneTally_API_GatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Authorization_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/GET/spotifyLogin"
}

resource "aws_lambda_permission" "Allow_TuneTally_Callback_Lambda" {
  statement_id  = "AllowTuneTally_API_GatewayInvokeCallback"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Authorization_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/GET/spotifyLoginCallback"
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
      "/spotifyLogin" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Authorization_Lambda.invoke_arn
          }
        }
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
            type             = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
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
      "/spotifyLoginCallback" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Authorization_Lambda.invoke_arn
          }
        }
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
            type             = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
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