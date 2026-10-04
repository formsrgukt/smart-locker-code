import re, json

with open('src/app/login/animationContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

html_match = re.search(r'export const animationHtml = (.*);$', content, re.DOTALL)
if html_match:
    html = json.loads(html_match.group(1))
    
    html = re.sub(r'<div class="steps" aria-hidden="true">.*?<div class="stage"', '<div class="stage"', html, flags=re.DOTALL)
    new_content = f'export const animationHtml = {json.dumps(html)};'
    with open('src/app/login/animationContent.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated animationContent.ts')
else:
    print('Failed to match')
