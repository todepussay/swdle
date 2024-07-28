import "@styles/Debuffs.css";
import DebuffType from "@models/Debuff";
import Debuff from "@components/Debuff";

interface DebuffsProps {
    debuffs: DebuffType[];
}

function Debuffs({ debuffs }: DebuffsProps) {
    return (
        <div className="Debuffs">
            {
                debuffs.map((debuff, index) => (
                    <Debuff
                        key={index}
                        debuff={debuff}
                    />
                ))
            }
        </div>
    )
}

export default Debuffs;