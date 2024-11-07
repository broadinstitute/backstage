.PHONY: help
# Put it first so that "make" without argument is like "make help"
# Adapted from:
# https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## List Makefile targets.
	$(info Makefile documentation)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

PROJECT_DIR = ${{ values.name | replace("-", "_") }}

clean: ## Remove temp build/cache files and directories.
	rm --recursive --force ./dist
	rm --recursive --force ./build
	rm --recursive --force ./*.egg-info
	rm --recursive --force ./**/__pycache__/
	rm --recursive --force .ruff_cache/
	rm --recursive --force .pytest_cache/

build: ## Build Python package.
	poetry build
{% if values.pypiRepository %}
MAKE_PYPI_REPOSITORY ?= ${{ values.pypiRepository }}
publish: ## Build and upload package to private registry. Defaults to "${{ values.pypiRepository }}", modify this with MAKE_PYPI_REPOSITORY.
	poetry publish --build --repository $(MAKE_PYPI_REPOSITORY)
{%- endif %}

test: ## Run Python unit tests.
	poetry run pytest

lint: ## Run static analysis tools.
	poetry run ruff check --fix $(PROJECT_DIR)/
	poetry run ruff check --fix tests/
	poetry run pyright $(PROJECT_DIR)/ tests/

format: ## Autoformat code/yaml/markdown.
	poetry run ruff format $(PROJECT_DIR)/ tests/
	prettier --write docs

ci: format lint test ## Run all tests required by CI to merge.
