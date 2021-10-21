terraform {
    backend "s3" {
        bucket = "BUCKET"
        key = "my-project/terraform.tfstate"
        region = "REGION"
    }
}