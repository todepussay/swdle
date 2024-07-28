import "@styles/Buffs.css";
import BuffType from "@models/Buff";
import Buff from "@components/Buff";

interface BuffsProps {
    buffs: BuffType[];
}

function Buffs({ buffs }: BuffsProps) {
    return (
        <div className="Buffs">
            {
                buffs.map((buff, index) => (
                    <Buff
                        key={index}
                        buff={buff}
                    />
                ))
            }
        </div>
    )
}

export default Buffs;