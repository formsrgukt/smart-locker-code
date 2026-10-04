import re

with open('smart-locker-login.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_match = re.search(r'<head>.*?</style>', html, re.DOTALL)
head = head_match.group(0) + '\n</head>' if head_match else ''

showcase_match = re.search(r'<aside class=\"showcase\".*?</aside>', html, re.DOTALL)
showcase = showcase_match.group(0) if showcase_match else ''

script_match = re.search(r'<script>.*?</script>', html, re.DOTALL)
script = script_match.group(0) if script_match else ''

new_css = head
new_css = re.sub(r'\.card \{[^}]+\}', '', new_css)
new_css = re.sub(r'body \{[^}]+\}', 'body { margin: 0; min-height: 100vh; overflow: hidden; background: transparent; font-family: Lexend, Inter, sans-serif; }', new_css)
new_css = re.sub(r'\.showcase \{[^}]+\}', '.showcase { height: 100vh; width: 100vw; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 22px; padding: 34px 30px 30px; background: transparent; }', new_css)

output = f"""<!DOCTYPE html>
<html lang="en">
{new_css}
<body>
{showcase}
{script}
</body>
</html>"""

with open('public/login-animation.html', 'w', encoding='utf-8') as f:
    f.write(output)
print('Created public/login-animation.html')
