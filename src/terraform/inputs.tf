variable "cluster_name" {
    type = string
}
variable "image" {
    type = string
}
variable "namespace" {
    type = string
    default = "default"
}
variable "jobs_history" {
    type = object({
        failed = number
        successful = number
    })
    default = {
        failed = 5
        successful = 2
    }
}
variable "backoff_limit" {
    type = number
    default = 4 
}

variable "boards" {
    type = list(object({
        name = string
        schedule = string
    }))
    default = []
}