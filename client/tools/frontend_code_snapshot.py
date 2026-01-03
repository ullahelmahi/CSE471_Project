import os
from pygments import highlight
from pygments.lexers import JavascriptLexer, CssLexer, HtmlLexer, TextLexer
from pygments.formatters import ImageFormatter

# ================= CONFIG =================
FRONTEND_ROOT = "src"   # because you run from client/
OUTPUT_DIR = "frontend_code_snapshots"

SUPPORTED_EXTENSIONS = {
    ".js": JavascriptLexer,
    ".jsx": JavascriptLexer,
    ".ts": JavascriptLexer,
    ".tsx": JavascriptLexer,
    ".css": CssLexer,
    ".html": HtmlLexer,
}
# ==========================================

# Create output folder
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_lexer(ext):
    return SUPPORTED_EXTENSIONS.get(ext, TextLexer)

def snapshot_file(file_path, relative_path):
    ext = os.path.splitext(file_path)[1]
    lexer = get_lexer(ext)()

    # Read code file
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        code = f.read()

    # VS Code–style formatter
    formatter = ImageFormatter(
        font_name="Consolas",          # Windows-safe font
        font_size=15,
        line_numbers=True,
        style="material",              # VS Code–like dark theme
        image_format="png",
        line_pad=6,
        background_color="#1e1e1e",
        line_number_bg="#1e1e1e",
        line_number_fg="#858585",
    )

    # Generate image
    image_data = highlight(code, lexer, formatter)

    safe_name = relative_path.replace("/", "_").replace("\\", "_")
    output_path = os.path.join(OUTPUT_DIR, safe_name + ".png")

    with open(output_path, "wb") as img:
        img.write(image_data)

    print(f"📸 Snapshot saved: {output_path}")

# Walk through all frontend files
for root, _, files in os.walk(FRONTEND_ROOT):
    for file in files:
        ext = os.path.splitext(file)[1]
        if ext in SUPPORTED_EXTENSIONS:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, FRONTEND_ROOT)
            snapshot_file(full_path, rel_path)

print("\n🎉 ALL FRONTEND CODE SNAPSHOTS GENERATED SUCCESSFULLY!")
