import re
from app import app

client = app.test_client()
routes = [
    '/',
    '/petualangan',
    '/misi/1',
    '/misi/2',
    '/misi/3',
    '/misi/4',
    '/misi/5',
    '/misi/6',
    '/simulasi',
    '/hasil',
    '/rekomendasi',
    '/sumber',
    '/guru'
]

all_links = set()
for r in routes:
    resp = client.get(r)
    assert resp.status_code == 200, f"Route {r} returned status {resp.status_code}"
    html = resp.get_data(as_text=True)
    links = re.findall(r'href=[\"\'](/[^\"\'#?]+)', html)
    for l in links:
        if not l.startswith('//'):
            all_links.add(l)

print(f"Total routes verified: {len(routes)}")
print(f"Discovered {len(all_links)} internal links:")
for l in sorted(all_links):
    res = client.get(l)
    print(f"Checking {l} -> Status: {res.status_code}")
    assert res.status_code in [200, 302], f"Broken link: {l}"

print("\nSUCCESS: All routes and internal links are 100% valid and verified without broken links!")
