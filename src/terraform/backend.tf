terraform {
    backend "s3" {
        bucket = "BUCKET"
        key = "project-name/terraform.tfstate"
        region = "REGION"
    }
}