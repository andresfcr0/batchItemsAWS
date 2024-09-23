data "aws_caller_identity" "current" {}

data "archive_file" "cups_codes_file" {
  type        = "zip"
  source_dir  = "../dist"
  output_path = "files/cups_codes.zip"
}
