#!/usr/bin/env python3
"""Expand template YAML files that use $yaml anchors and aliases."""
import argparse
import re
import sys

from pathlib import Path


class PlaceholderParseError(Exception):
    """Raised when parsing out the placeholder does not work as expected."""


def parse_arguments():
    """Parse command-line arguments using argparse"""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "-t",
        "--template",
        help="The path to the template file",
        required=True,
    )

    return parser.parse_args()


def expand_yaml_placeholder(template_path: Path, line: str):
    """Expand a line with a $yaml placeholder and return all lines.

    Args:
        template_path: A Path object with the path to the template being read
        line: The line in the file being parsed
    Returns:
        A list of strings, where each string is a line for the expanded YAML
        file, including necessary indentation and newlines.
    """
    re_group = re.search(r"^(.*)\$yaml:\s+(.*)", line)
    if not re_group:
        raise PlaceholderParseError("Placeholder value not found.")
    prefix = re_group.group(1)
    yaml_file = re_group.group(2)
    path = template_path.parent / yaml_file

    file_contents = []
    with open(path.resolve()) as filep:
        for line in filep:
            mod_line = line.rstrip()
            # Don't add prefixed space to empty lines
            if not mod_line:
                file_contents.append("\n")
            else:
                file_contents.append(f"{' '*len(prefix)}{mod_line}\n")
    if file_contents:
        # Replace the prefixed space in the first line with the prefix from the
        # placeholder line we found.
        file_contents[0] = re.sub(r"^\s+", prefix, file_contents[0])

    return file_contents


def expand_template(template_path: Path):
    """Read a template YAML file and expand any $yaml placeholders found

    Args:
        template_path: A Path object with the path to the template being read

    Returns:
        A list of lines with the expanded template contents.
        If an error occurs, an empty list is returned.
    """
    output = []
    line_number = 0
    with open(template_path) as filep:
        for line in filep:
            line_number += 1
            if "$yaml" in line:
                try:
                    output += expand_yaml_placeholder(template_path, line)
                except FileNotFoundError as exc:
                    print(f"Error on line {line_number} of {template_path}:", file=sys.stderr)
                    print(f"\t{str(exc.args[1])}: {str(exc.filename)}", file=sys.stderr)
                    return []
            else:
                output.append(line)

    return output


def main():
    """Execute the template expansion script."""
    args = parse_arguments()
    template_path = Path(args.template).resolve()
    if not template_path.is_file():
        print(f"Template file not found: {template_path}", file=sys.stderr)
        return 1

    template_dir = template_path.parent
    expanded_contents = expand_template(template_path)
    if not expanded_contents:
        print("FATAL: Template could not be expanded.")
        return 1

    new_file = template_dir / f"{template_path.stem}.expanded{template_path.suffix}"

    with open(new_file, "w") as filep:
        # Print to file without newlines. Newlines are already set for each
        # entry in the contents.
        print("".join(expanded_contents), file=filep, end="")

    return 0


if __name__ == "__main__":
    main()
