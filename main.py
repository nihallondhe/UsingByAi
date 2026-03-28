#!/usr/bin/env python3

import sys

def main() -> None:
    """
    Prints a professional greeting to standard output.
    """
    try:
        print("Hello, World!")
    except IOError as e:
        sys.stderr.write(f"Error: Unable to write to stdout: {e}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()