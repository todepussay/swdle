import json, os, shutil

# chemin = "data.json"
# 
# with open(chemin, "r") as f:
#     data = json.load(f)
# 
# liste = []
# 
# for elt in data:
#     if elt["model"] == "bestiary.monster" and elt["fields"]['obtainable'] and elt['fields']["is_awakened"]:
#         print(elt["pk"], elt["fields"]["name"])
#         liste.append(elt)
# 
# with open("monsters.json", "w") as f:
#     json.dump(liste, f, indent=4)
# 
# print(len(liste))

with open("monsters.json", "r") as f:
    data = json.load(f)

print(len(data))

# for f in os.listdir("asset/unit_icon/"):
#     chemin_complet_source = os.path.join("asset/unit_icon/", f)
# 
#     if os.path.isfile(chemin_complet_source):
#         for elt in data:
#             if elt["fields"]["image_filename"] == f:
#                shutil.move(chemin_complet_source, "asset/unit_icon/monsters/")
#                break