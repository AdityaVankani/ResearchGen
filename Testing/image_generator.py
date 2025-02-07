# Example directly sending a text string:

import requests
r = requests.post(
    "https://api.deepai.org/api/text2img",
    data={
        'text': 'A kid playing football.',
    },
    headers={'api-key': 'fae3aada-c331-42bf-8744-4a02ae97ab01'}
)
print(r.json())