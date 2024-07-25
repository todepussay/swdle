import Monster from '@models/Monster';

export default interface Family {
    family_id: number;
    family_name: string;
    monsters: Monster[];
}