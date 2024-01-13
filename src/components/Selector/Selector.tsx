import { Player } from "../../common/types";

type SelectorProps = {
  players: Player[];
  selectedPlayers: Player[];
  addPlayerToSelection: (player: Player) => void;
};

const Selector = (props: SelectorProps) => {
  const sorted = [...props.players].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="selector">
      <h2>All Players (click to add)</h2>
      <h3>{props.selectedPlayers.length}/6 players selected</h3>

      <ul className="selector__players">
        {sorted.map((player) => {
          return (
            <li
              key={player.name}
              className="selector__player"
              onClick={() => props.addPlayerToSelection(player)}
            >
              {player.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Selector;
