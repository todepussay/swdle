import Buff from "@models/Buff";
import Debuff from "@models/Debuff";

export default interface GuessMonster {
    correct: boolean;
    date: Date;
    indice: {};
    try: number;
    information: {
        id_monster: number;
        name_monster: string;
        image_monster: string;
        natural_stars_monster: number;
        natural_stars_good: boolean;
        natural_stars_more: boolean;
        natural_stars_less: boolean;
        second_awakened_monster: boolean;
        second_awakened_good: boolean;
        element_monster: string;
        element_good: boolean;
        archetype_monster: string;
        archetype_good: boolean;
        family_monster_id: number;
        family_monster_name: string;
        family_good: boolean;
        leader_skill_monster: boolean;
        leader_skill_good: boolean;
        fusion_food_monster: boolean;
        fusion_food_good: boolean;
        date: Date;
        buffs: Buff[];
        debuffs: Debuff[];
        buffs_good: boolean;
        buffs_partiel: boolean;
        debuffs_good: boolean;
        debuffs_partiel: boolean;
    }
}