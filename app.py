import json, os, shutil

chemin = "data.json"

with open(chemin, "r") as f:
    data = json.load(f)

sql = ""

# Skill

# for elt in data:
#     if elt["model"] == "bestiary.skill":
#         sql += '''INSERT INTO `skill` (`id`, `com2us_id`, `name`, `description`, `slot`, `cooltime`, `hits`, `aoe`, `passive`, `max_level`, `icon_filename`) VALUES ({}, {}, "{}", "{}", {}, {}, {}, {}, {}, {}, "{}");\n'''.format(
#             elt["pk"], 
#             elt["fields"]["com2us_id"], 
#             elt["fields"]["name"], 
#             elt["fields"]["description"].replace('\n', ' '), 
#             elt["fields"]["slot"], 
#             0 if elt["fields"]["cooltime"] == None else elt["fields"]["cooltime"], 
#             elt["fields"]["hits"], 
#             1 if elt["fields"]["aoe"] == "True" or elt["fields"]["aoe"] == "False" else 0, 
#             1 if elt["fields"]["passive"] == "True" or elt["fields"]["passive"] == "False" else 0, 
#             elt["fields"]["max_level"], 
#             elt["fields"]["icon_filename"])

# with open("skill.sql", "w", encoding='utf-8') as f:
#     f.write(sql)

# Family

# traduction = {
#     'Angelmon': 'Angemon',
#     'King Angelmon': 'Roi angemon',
#     'Low Elemental': 'Elémentaire faible',
#     'Elemental': 'Elémentaire',
#     'Garuda': 'Garuda',
#     'Harpu': 'Harpu',
#     'Hellhound': 'Cerbère',
#     'Howl': 'Howl',
#     'Imp': 'Diablotin',
#     'Pixie': 'Lutin',
#     "Warbear": "L'ours de guerre",
#     'Yeti': 'Yéti',
#     'Salamander': 'Salamander',
#     'Vagabond': 'Vagabond',
#     'Viking': 'Viking',
#     'Fairy': 'Fée',
#     'Amazon': 'Amazone',
#     'Battle Mammoth': 'Mammouth de combat',
#     'Bearman': 'Bearman',
#     'Beast Hunter': 'Chasseur de bêtes',
#     'Bounty Hunter': 'Chasseur de tête',
#     'Drunken Master': 'Maître ivre',
#     'Cow Girl': 'Cowgirl',
#     'Golem': 'Golem',
#     'Griffon': 'Griffon',
#     'Grim Reaper': 'Faucheuse',
#     'Harpy': 'Harpie',
#     'High Elemental': 'Haut élémentaire',
#     'Imp Champion': 'Lutin champion',
#     'Inferno': 'Inferno',
#     'Inugami': 'Inugami',
#     'Living Armor': 'Armure vivante',
#     'Lizardman': 'Homme-lézard',
#     'Magical Archer': 'Archer Magique',
#     'Martial Cat': 'Chat martial',
#     'Minotauros': 'Minotaure',
#     'Mystic Witch': 'Sorcière mystique',
#     'Penguin Knight': 'Chevalier pingouin',
#     'Serpent': 'Serpent',
#     'Taoist': 'Taoiste',
#     'Werewolf': 'Loup-garou',
#     'Barbaric King': 'Roi barbare',
#     'Brownie Magician': 'Brownie le Magicien',
#     'Death Knight': 'Chevalier de la mort',
#     'Epikion Priest': 'Prêtre Epikion',
#     'Joker': 'Joker',
#     'Kobold Bomber': 'Kobold Bombeur',
#     'Kung Fu Girl': 'Kung-fu girl',
#     'Lich': 'Liche',
#     'Nine-tailed Fox': 'Kitsuné',
#     'Ninja': 'Ninja',
#     'Phantom Thief': 'Voleur fantôme',
#     'Pierret': 'Pierrette',
#     'Rakshasa': 'Rakshasa',
#     'Samurai': 'Samouraï',
#     'Sky Dancer': 'Danseur du ciel',
#     'Succubus': 'Succube',
#     'Sylph': 'Sylphe',
#     'Sylphid': 'Sylphide',
#     'Undine': 'Ondine',
#     'Vampire': 'Vampire',
#     'Archangel': 'Archange',
#     'Beast Monk': 'Moine bestial',
#     'Chimera': 'Chimère',
#     'Dragon': 'Dragon',
#     'Dragon Knight': 'Chevalier dragon',
#     "Hell Lady": "Dame de l'Enfer",
#     'Ifrit': 'Ifrit',
#     'Monkey King': 'Roi singe',
#     'Occult Girl': 'Fille occulte',
#     'Oracle': 'Oracle',
#     'Phoenix': 'Phénix',
#     'Pioneer': 'Pionnier',
#     'Polar Queen': 'Reine polaire',
#     'Valkyrja': 'Valkyrie',
#     'Fairy Queen': 'Reine des fées',
#     'Charger Shark': 'Requin coursier',
#     'Pirate Captain': 'Capitaine pirate',
#     'Mermaid': 'Sirène',
#     'Sea Emperor': 'Empereur de la mer',
#     'Magic Knight': 'Chevalier magique',
#     "Elite Magical Archer": "Archer magique d'élite",
#     'Assassin': 'Assassin',
#     'Neostone Agent': 'Agent néostone',
#     'Martial Artist': 'Expert en art martial',
#     'Neostone Fighter': 'Combattant néostone',
#     'Mummy': 'Momie',
#     'Anubis': 'Anubis',
#     'Horus': 'Horus',
#     'Desert Queen': 'Reine du désert',
#     'Frankenstein': 'Frankenstein',
#     "Jack-o'-lantern": "Citrouille de Halloween",
#     'Elven Ranger': 'Elfe patrouilleur',
#     'Harg': 'Harg',
#     'Fairy King': 'Roi des fées',
#     'Panda Warrior': 'Guerrier panda',
#     'Homunculus(Attack)': 'Homunculus(Attaque)',
#     'Dice Magician': 'Maître des dés',
#     'Harp Magician': 'Joueuse de harpe',
#     'Unicorn': 'Licorne',
#     'Homunculus(Support)': 'Homunculus(Support)',
#     'Paladin': 'Paladin',
#     'Chakram Dancer': 'Danseuse aux chakrams',
#     'Boomerang Warrior': 'Guerrière au Boomerang',
#     'Dryad': 'Dryade',
#     'Druid': 'Druide',
#     'Giant Warrior': 'Guerrier géant',
#     'Lightning Emperor': 'Empereur des foudres',
#     'Sniper Mk.I': 'Sniper Mk.I',
#     'Cannon Girl': 'Cannon Girl',
#     'Vampire Lord': 'Seigneur Vampire',
#     'Demon': 'Démon',
#     'Gargoyle': 'Gargouille',
#     'Beast Rider': 'Chasseresse au fauve',
#     'Art Master': 'Peintre',
#     'String Master': 'Virtuose à la cithare',
#     'Striker': 'Striker',
#     "Shadow Claw": "Griffes de l'ombre",
#     'Slayer': 'Slayer',
#     'Poison Master': 'Maître des poisons',
#     'Blade Dancer': 'Danseuse aux lames',
#     'Onmyouji': 'Onmyouji',
#     'Onimusha': 'Onimusha',
#     'Mage': 'Mage',
#     'Sky Surfer': 'Surfeur céleste',
#     'ROBO': 'ROBO',
#     'Totemist': 'Totémiste',
#     "Weapon Master": "Maître d'armes",
#     'Rune Blacksmith': 'Forgeronne',
#     'Shadowcaster': 'Ombromancien',
#     'Hypnomeow': 'Hypnomiaou',
#     'Battle Angel': 'Ange de combat',
#     'Lollipop Warrior': 'Guerrier sucette',
#     'Pudding Princess': 'Princesse Pudding',
#     'Macaron Guard': 'Garde Macaron',
#     'Black Tea Bunny': 'Dame Thé noir',
#     'Choco Knight': 'Chevalier Choco',
#     'Puppeteer': 'Marionnettiste',
#     'Dual Blade': 'Double Lame',
#     "Steel Commander": "Commandeur d'acier",
#     'Desert Warrior': 'Guerrier du désert',
#     'Gladiatrix': 'Gladiatrice',
#     'Mercenary Queen': 'Reine des mercenaires',
#     'Indra': 'Indra',
#     'Asura': 'Asura',
#     'Devil Maiden': 'Demoiselle des Enfers'
# }

# liste = []

# for elt in data:
#      if elt["model"] == "bestiary.monster" and elt["fields"]["obtainable"] and elt["fields"]["is_awakened"] == False and elt["fields"]["can_awaken"] == True:
#         dico = {}
#         dico["id"] = elt["fields"]["family_id"]
#         dico["name"] = traduction[elt["fields"]["name"]]
#         if dico not in liste:
#             liste.append(dico)

# for elt in liste:
#     sql += '''INSERT INTO `family` (`id`, `name`) VALUES ({}, "{}");\n'''.format(elt["id"], elt["name"])

# with open("family.sql", "w", encoding='utf-8') as f:
#     f.write(sql)

# Monster

# for elt in data:
#     if elt["model"] == "bestiary.monster" and elt["fields"]["obtainable"] and elt["fields"]["is_awakened"] == True:
#         sql += '''INSERT INTO `monster` (`id`, `name`, `com2us_id`, `family_id`, `image_filename`, `element`, `archetype`, `base_stars`, `natural_stars`, `awaken_level`, `skill_ups_to_max`, `leader_skill`, `raw_hp`, `raw_attack`, `raw_defense`, `base_hp`, `base_attack`, `base_defense`, `max_lvl_hp`, `max_lvl_attack`, `max_lvl_defense`, `speed`, `crit_rate`, `crit_damage`, `resistance`, `accuracy`, `homunculus`, `awaken_mats_fire_low`, `awaken_mats_fire_mid`, `awaken_mats_fire_high`, `awaken_mats_water_low`, `awaken_mats_water_mid`, `awaken_mats_water_high`, `awaken_mats_wind_low`, `awaken_mats_wind_mid`, `awaken_mats_wind_high`, `awaken_mats_light_low`, `awaken_mats_light_mid`, `awaken_mats_light_high`, `awaken_mats_dark_low`, `awaken_mats_dark_mid`, `awaken_mats_dark_high`, `awaken_mats_magic_low`, `awaken_mats_magic_mid`, `awaken_mats_magic_high`, `farmable`, `fusion_food`) VALUES ({}, "{}", {}, {}, "{}", "{}", "{}", {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {});\n'''.format(
#             elt["pk"],
#             elt["fields"]["name"],
#             elt["fields"]["com2us_id"],
#             elt["fields"]["family_id"],
#             elt["fields"]["image_filename"],
#             elt["fields"]["element"],
#             elt["fields"]["archetype"],
#             elt["fields"]["base_stars"],
#             elt["fields"]["natural_stars"],
#             elt["fields"]["awaken_level"],
#             elt["fields"]["skill_ups_to_max"],
#             0 if elt["fields"]["leader_skill"] is None else 1,
#             elt["fields"]["raw_hp"],
#             elt["fields"]["raw_attack"],
#             elt["fields"]["raw_defense"],
#             elt["fields"]["base_hp"],
#             elt["fields"]["base_attack"],
#             elt["fields"]["base_defense"],
#             elt["fields"]["max_lvl_hp"],
#             elt["fields"]["max_lvl_attack"],
#             elt["fields"]["max_lvl_defense"],
#             elt["fields"]["speed"],
#             elt["fields"]["crit_rate"],
#             elt["fields"]["crit_damage"],
#             elt["fields"]["resistance"],
#             elt["fields"]["accuracy"],
#             1 if elt["fields"]["homunculus"] == "True" or elt["fields"]["homunculus"] == "False" else 0,
#             elt["fields"]["awaken_mats_fire_low"],
#             elt["fields"]["awaken_mats_fire_mid"],
#             elt["fields"]["awaken_mats_fire_high"],
#             elt["fields"]["awaken_mats_water_low"],
#             elt["fields"]["awaken_mats_water_mid"],
#             elt["fields"]["awaken_mats_water_high"],
#             elt["fields"]["awaken_mats_wind_low"],
#             elt["fields"]["awaken_mats_wind_mid"],
#             elt["fields"]["awaken_mats_wind_high"],
#             elt["fields"]["awaken_mats_light_low"],
#             elt["fields"]["awaken_mats_light_mid"],
#             elt["fields"]["awaken_mats_light_high"],
#             elt["fields"]["awaken_mats_dark_low"],
#             elt["fields"]["awaken_mats_dark_mid"],
#             elt["fields"]["awaken_mats_dark_high"],
#             elt["fields"]["awaken_mats_magic_low"],
#             elt["fields"]["awaken_mats_magic_mid"],
#             elt["fields"]["awaken_mats_magic_high"],
#             1 if elt["fields"]["farmable"] == "True" else 0,
#             1 if elt["fields"]["fusion_food"] == "True" else 0
#         )

# with open("monster.sql", "w", encoding='utf-8') as f:
#     f.write(sql)

# MonsterSkill

for elt in data:
    if elt["model"] == "bestiary.monster" and elt["fields"]["obtainable"] and elt["fields"]["is_awakened"] == True:
        for skill in elt["fields"]["skills"]:
            sql += '''INSERT INTO `monster_skill` (`monster_id`, `skill_id`, `slot`) VALUES ({}, {}, {});\n'''.format(
                elt["pk"],
                skill,
                elt["fields"]["skills"].index(skill) + 1
            )

with open("monster_skill.sql", "w", encoding='utf-8') as f:
    f.write(sql)

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

# with open("monsters.json", "r") as f:
#     data = json.load(f)

# print(len(data))

# for f in os.listdir("asset/unit_icon/"):
#     chemin_complet_source = os.path.join("asset/unit_icon/", f)
# 
#     if os.path.isfile(chemin_complet_source):
#         for elt in data:
#             if elt["fields"]["image_filename"] == f:
#                shutil.move(chemin_complet_source, "asset/unit_icon/monsters/")
#                break

# Création du fichier sql