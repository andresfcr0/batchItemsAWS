resource "aws_dynamodb_table" "basic-dynamodb-table-cups-codes" {
  name           = "DEV-B-MEDICAL-Calc-CupsCodes"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "code"

  attribute {
    name = "code"
    type = "S"
  }

  tags = {
    Name        = "medical-predictions-cups-codes"
    Environment = "development"
    Description = "Tabla de codigos de Clasificacion Unica de Procedimientos en Salud"
  }
}

resource "aws_dynamodb_table" "basic-dynamodb-table-features" {
  name           = "MEDICAL_FEATURE_NAMES"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "category"

  attribute {
    name = "category"
    type = "S"
  }

  tags = {
    Name        = "datamining-predictions-feature-names"
    Environment = "development"
    Description = "Tabla de nombres de codigos"
  }
}