"""One-shot i18n fixer v2: move aethelTeam blocks 2 and 3 into the fr and tr dicts."""

p = "src/lib/i18n.tsx"
src = open(p, encoding="utf-8").read()


def extract_block(source: str, opener_index: int) -> tuple[str, str]:
    """Return (block_text, source_without_block) starting at opener_index."""
    start = source.find("\n", opener_index) + 1  # first line after opener
    end = source.find("\n  },\n", start)
    assert end != -1, "block end not found"
    end += len("\n  },\n")
    return source[opener_index:end], source[:opener_index] + source[end:]


# Block 2 (fr) sits at the 2nd "  aethelTeam: {" occurrence; block 3 (tr) shifts
# up to the 2nd occurrence after block 2 is removed.
first = src.find("  aethelTeam: {")
second = src.find("  aethelTeam: {", first + 1)
assert first != -1 and second != -1, "blocks not found"

fr_block, src = extract_block(src, second)
# After removal, the tr block is now the 2nd occurrence again.
first2 = src.find("  aethelTeam: {")
second2 = src.find("  aethelTeam: {", first2 + 1)
assert second2 != -1, "tr block not found after fr removal"
tr_block, src = extract_block(src, second2)

assert src.count("aethelTeam: {") == 1, "should be exactly 1 block left (en)"


def nth_index(source: str, needle: str, n: int) -> int:
    idx = -1
    for _ in range(n):
        idx = source.find(needle, idx + 1)
        assert idx != -1, f"only found {n - 1} occurrences of {needle!r}"
    return idx


fr_final = nth_index(src, "  finalCta: {", 2)
src = src[:fr_final] + fr_block + src[fr_final:]

tr_final = nth_index(src, "  finalCta: {", 3)
src = src[:tr_final] + tr_block + src[tr_final:]

open(p, "w", encoding="utf-8").write(src)
print("aethelTeam count:", src.count("aethelTeam: {"))
print("finalCta count:", src.count("finalCta: {"))
