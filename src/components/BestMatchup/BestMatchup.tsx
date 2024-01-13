import { Player } from "../../common/types";

import vsImage from '../../Street_Fighter_VS_logo.png';

type BestMatchupProps = {
  bestMatchup: Player[][];
};

const BestMatchup = (props: BestMatchupProps) => {
  return (
    <div className="best-matchup">
      <div className="best-matchup__team">
        <h3>Team 1</h3>
        <ul>
          {props.bestMatchup[0].map((player) => <li key={player.name} className="best-matchup__player">{player.name}</li>)}
        </ul>
      </div>
      <img className="best-matchup__vs" alt='versus' src={vsImage} />
      <div className="best-matchup__team">
        <h3>Team 2</h3>
        <ul>
          {props.bestMatchup[1].map((player) => <li key={player.name} className="best-matchup__player">{player.name}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default BestMatchup;
