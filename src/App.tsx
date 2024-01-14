import { useEffect, useState } from "react";

import "./App.scss";
import GSheetReader from "g-sheets-api";

import Selector from "./components/Selector/Selector";

import { SheetsData, Player } from "./common/types";
import SelectedPlayers from "./components/SelectedPlayers/SelectedPlayers";
import BestMatchup from "./components/BestMatchup/BestMatchup";
import Spinner from "./components/Spinner/Spinner";

const SHEET_ID = "1bbuqaICsB7cxN1jp_53oSpGgVW_pyu0zGxkkUff9R14";
const API_KEY = "AIzaSyD7_wNQiELw6tOoawIIBqnF_lgh_v6oYIA";
const SCORE_CALCULATION_METHOD: "points" | "pointsPerGame" = "pointsPerGame";
const NEW_PLAYER: Player = {
  name: "New Player",
  points: 1,
  pointsPerGame: 1,
};
const NUM_PLAYERS_IN_MATCH = 6;
const NUM_TEAMS_IN_MATCH = 2;

function App() {
  const [players, setPlayers] = useState<Player[] | []>([NEW_PLAYER]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[] | []>([]);
  const [unselectedPlayers, setUnselectedPlayers] = useState<Player[] | []>([]);
  const [sortedMatchups, setSortedMatchups] = useState<Player[][][] | []>([]);
  const [matchupIndex, setMatchupIndex] = useState(0);
  const [playerDataLoaded, setPlayerDataLoaded] = useState(false);

  const setPlayerData = () => {
    const options = {
      apiKey: API_KEY,
      sheetId: SHEET_ID,
      sheetNumber: 1,
      returnAllResults: false,
    };

    GSheetReader(
      options,
      (results: SheetsData) => {
        const formatted = formatPlayerData(results);
        setPlayers([...players, ...formatted]);
        setPlayerDataLoaded(true);
      },
      (err: Error) => {
        console.error(err);
      }
    );
  };

  const formatPlayerData = (sheetsData: SheetsData): Player[] =>
    sheetsData
      .filter((sheetRow) => sheetRow.name !== "")
      .map((sheetRow) => ({
        name: sheetRow.name,
        points: parseInt(sheetRow["points total"], 10),
        pointsPerGame: parseFloat(sheetRow["avg. pts per game"]),
      }));

  useEffect(() => {
    setPlayerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setUnselectedPlayers(players);
  }, [players]);

  const addPlayerToSelection = (player: Player) => {
    if (selectedPlayers.length === NUM_PLAYERS_IN_MATCH) return;
    setSelectedPlayers([...selectedPlayers, player]);
    setUnselectedPlayers(
      unselectedPlayers.filter(
        (unselectedPlayer) => unselectedPlayer.name !== player.name
      )
    );
    if (selectedPlayers.length < 5) {
      new Audio(require("./sound.wav")).play();
    } else {
      new Audio(require("./audio.mp3")).play();
    }
  };

  const removePlayerFromSelection = (player: Player) => {
    setUnselectedPlayers([...unselectedPlayers, player]);
    setSelectedPlayers(
      selectedPlayers.filter(
        (selectedPlayer) => selectedPlayer.name !== player.name
      )
    );
  };

  const getAllTeams = (players: Player[]) => {
    const teams = [];

    for (let i = 0; i < players.length; i++) {
      for (let j = 1; j < players.length; j++) {
        for (let k = 2; k < players.length; k++) {
          if (k > j && j > i) {
            teams.push([players[i], players[j], players[k]]);
          }
        }
      }
    }

    return teams;
  };

  const getOpposingTeam = (team: Player[], players: Player[]) =>
    players.filter(
      (player) => !team.find((teamPlayer) => teamPlayer.name === player.name)
    );

  const getAllMatches = (teams: Player[][], players: Player[]) =>
    teams.map((team) => [team, getOpposingTeam(team, players)]);

  const getTeamScore = (team: Player[]) =>
    team.reduce((acc, player) => acc + player[SCORE_CALCULATION_METHOD], 0);

  const getScoreDifference = (team1: Player[], team2: Player[]) =>
    Math.abs(getTeamScore(team1) - getTeamScore(team2));
  
  const getSortedMatchups = (chosenPlayers: Player[]) => {
    const teams = getAllTeams(chosenPlayers);

    const matches = getAllMatches(teams, chosenPlayers);


    const sorted = [...matches].sort(
      (matchup1: Player[][], matchup2: Player[][]) =>
        // @ts-ignore
        getScoreDifference(...matchup1) - getScoreDifference(...matchup2)
    );

    return sorted;
  };

  const onShuffleClicked = () => {
    const bestMatchup = getSortedMatchups(selectedPlayers);
    setSortedMatchups(bestMatchup);
    new Audio(require("./noise.mp3")).play();
  };

  const onReshuffleClicked = () => {
    setMatchupIndex((matchupIndex + NUM_TEAMS_IN_MATCH) % sortedMatchups.length);
    new Audio(require("./noise.mp3")).play();
  };

  const onResetClicked = () => {
    setUnselectedPlayers(players);
    setSelectedPlayers([]);
    setSortedMatchups([]);
    new Audio(require("./oof.wav")).play();
  };

  return (
    <div className="App">
      <h1>Polo Shuffler</h1>
      {!playerDataLoaded ? <Spinner /> : null}
      {playerDataLoaded && selectedPlayers.length < NUM_PLAYERS_IN_MATCH ? (
        <Selector
          selectedPlayers={selectedPlayers}
          players={unselectedPlayers}
          addPlayerToSelection={addPlayerToSelection}
        />
      ) : null}
      {selectedPlayers.length > 0 && sortedMatchups.length === 0 ? (
        <SelectedPlayers
          selectedPlayers={selectedPlayers}
          removePlayerFromSelection={removePlayerFromSelection}
        />
      ) : null}
      {selectedPlayers.length === NUM_PLAYERS_IN_MATCH && sortedMatchups.length === 0 ? (
        <button className="button" onClick={onShuffleClicked}>
          Shuffle
        </button>
      ) : null}
      <div className="shuffled-actions">
        {selectedPlayers.length === NUM_PLAYERS_IN_MATCH && sortedMatchups.length > 0 ? (
          <button className="button" onClick={onReshuffleClicked}>
            Reshuffle
          </button>
        ) : null}
        {selectedPlayers.length === NUM_PLAYERS_IN_MATCH && sortedMatchups.length > 0 ? (
          <button className="button" onClick={onResetClicked}>
            Reset
          </button>
        ) : null}
      </div>
      {sortedMatchups.length ? (
        <BestMatchup bestMatchup={sortedMatchups[matchupIndex]}/>
      ) : null}
    </div>
  );
}

export default App;
