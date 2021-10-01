.DEFAULT_GOAL := $(ENV).tfplan

TF_FILES := $(shell find . -type f -name '*.tf')

%.tfvars.json: %.tfvars.yaml2json
	yaml2json $< > $@

%.tfplan: %.tfvars.json $(TF_FILES) workspace
	terraform plan -var-file $< -out $@

apply: $(ENV).tfplan
    terraform apply $<

init:
    [ -d .terraform ] || terraform init

workspace: init
    terraform workspace select $(ENV) || terraform workspace new $(ENV)

clean:
    find . -mindepth 1 -maxdepth 1 -type f -name '*.tfplan' | xargs --no-run-if-empty rm
    [ ! -e $(ENV).tfvars.json ] || rm $(ENV).tfvars.json

plan: $(ENV).tfplan

destroy: $(ENV).tfvars.json workspace
    terraform destroy -var-file $<

.PHONY: apply workspace init clean plan destroy

