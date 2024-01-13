import { Player } from "../../common/types";

type SelectedPlayersProps = {
  selectedPlayers: Player[];
  removePlayerFromSelection: (player: Player) => void;
};

const SelectedPlayers = (props: SelectedPlayersProps) => {
  return (
    <div className="selected-players">
      <h2>Selected Players (click to remove)</h2>

      <ul className="selected-players__players">
        {props.selectedPlayers.map((selectedPlayer) => {
          return (
            <li
              key={selectedPlayer.name}
              className="selected-players__player"
              onClick={() => props.removePlayerFromSelection(selectedPlayer)}
            >
              {selectedPlayer.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SelectedPlayers;
