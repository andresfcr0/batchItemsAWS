import json
result = []
with open('cups_codes.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()
    for line in lines:
        l = line.split("	", 1)
        result.append({"code": {"S": l[0]}, "value": {"S": l[1].strip()}})

with open("cups_codes.json", "w", encoding='utf-8') as outfile:
    json.dump(result, outfile, ensure_ascii=False)
