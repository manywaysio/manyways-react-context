import { set } from "lodash";
import React, { useEffect, useState } from "react";

/*
Based on where they are located, populate the Climate type and the HDD(metric).

Custom autosuggest based on https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=20%20st%20patrick%20str&maxSuggestions=6

Then find the candidate address: https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=20%20Rue%20St%20Patrick%2C%20Shannon%2C%20QC%2C%20G3S%201H2%2C%20CAN&f=json&magicKey=dHA9MCN0dj02NjIyYjk2NiNsb2M9MTkxOTg0MDcjbG5nPTUyI2ZhPTQ1ODc1MiNobj0yMCNsbj1Xb3JsZA%3D%3D&maxLocations=6

https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/Carte_climatique_HOT2000_Climate_Map_EN/MapServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&objectIds=209&outFields=*&outSR=3978

OR

LOOK UP the RIght sizing tool DB for Cities


AUTO FILL CLIMATE TYPE AND HDD (Heating degree days) and Heating Design Temperature
*/

const getSuggestions = async (address) => {
  let params = new URLSearchParams();
  params.set("maxSuggestions", "6");
  params.set("f", "json");
  params.set("text", address + ", CAN");

  return fetch(
    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?${params.toString()}`
  )
    .then((response) => response.json())
    .then((data) => data.suggestions);
};

const getCandidateAddress = async (candidate) => {
  let params = new URLSearchParams();
  params.set("f", "json");
  params.set("f", "json");
  params.set("magicKey", candidate.magicKey);
  params.set("SingleLine", candidate.text);
  params.set("maxLocations", "6");

  return fetch(
    `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`
  )
    .then((response) => response.json())
    .then((data) => {
      return {
        candidate: data.candidates[0],
        spatialReference: data.spatialReference,
      };
    });
};

const getClimateIndexes = async ({
  spatialReference: { wkid, latestWkid },
  candidate: {
    location: { x, y },
  },
}) => {
  // f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22x%22%3A1764670.1734761954%2C%22y%22%3A93682.60878034588%2C%22spatialReference%22%3A%7B%22wkid%22%3A3978%2C%22latestWkid%22%3A3978%7D%7D&geometryType=esriGeometryPoint&inSR=3978&outFields=*&outSR=3978

  let params = new URLSearchParams();
  params.set("f", "json");
  params.set("returnGeometry", "true");
  params.set("spatialRel", "esriSpatialRelIntersects");
  params.set(
    "geometry",
    JSON.stringify({ x, y, spatialReference: { wkid, latestWkid } })
  );
  params.set("geometryType", "esriGeometryPoint");
  params.set("inSR", wkid);
  params.set("outFields", "*");
  params.set("outSR", wkid);

  return fetch(
    `https://maps-cartes.services.geo.ca/server_serveur/rest/services/NRCan/Carte_climatique_HOT2000_Climate_Map_EN/MapServer/1/query?${params.toString()}`
  )
    .then((response) => response.json())
    .then((data) => data.features[0]);
};

const RightSizingLocationLookup = ({ value = "{}", onChange, disabled }) => {
  console.log(JSON.parse(value));

  const [addressvalue, setAddressValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [candidateAddress, setCandidateAddress] = useState(null);
  const [climateIndexes, setClimateIndexes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      let xx = JSON.parse(value);
      if (!!xx) {
        setAddressValue(xx.text);
        setClimateIndexes({ attributes: xx });
        console.log("set climate to ", xx);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddressChange = async (address) => {
    setAddressValue(address);
    if (address) {
      const suggestions = await getSuggestions(address);
      setSuggestions(suggestions);
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    setSelectedSuggestion(suggestion);
    const candidateAddress = await getCandidateAddress(suggestion);
    setCandidateAddress(candidateAddress);
    const climateIndexes = await getClimateIndexes(candidateAddress);
    setClimateIndexes(climateIndexes);
    onChange(
      JSON.stringify({
        ...suggestion,
        ...climateIndexes.attributes,
      })
    );
  };

  return (
    <div>
      {/* <button
        onClick={(e) => {
          e.preventDefault();
          console.log({
            value,
            suggestions,
            candidateAddress,
            climateIndexes,
            selectedSuggestion,
          });
        }}
      >
        Log
      </button> */}
      <input
        type="text"
        disabled={disabled}
        placeholder="Please input the first 3 characters of your postal code."
        value={selectedSuggestion?.text || addressvalue}
        onChange={(e) => {
          setSelectedSuggestion(null);
          handleAddressChange(e.target.value);
        }}
      />
      {!selectedSuggestion && (
        <ul>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.magicKey}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              {suggestion.text}
            </li>
          ))}
        </ul>
      )}
      {/* {selectedSuggestion && (
        <div>
          <h3>Selected Suggestion</h3>
          <p>{selectedSuggestion.text}</p>
        </div>
      )} */}
      {/* {candidateAddress && (
        <div>
          <h3>Candidate Address</h3>
          <p>{candidateAddress.address}</p>
        </div>
      )} */}
      {!!climateIndexes && typeof climateIndexes === "object" && (
        <div>

          {climateIndexes?.attributes?.Name && (
            <>
              <h3>Climate INDICES</h3>
              <div className="index-card">
                <h3>{climateIndexes?.attributes?.Name}</h3>
                <p className="text">{climateIndexes?.attributes?.text }</p>
                {climateIndexes?.attributes?.isCollection && (
                  <span>Is Collection</span>
                )}
                {climateIndexes?.attributes?.magicKey && (
                  <p className="magic-key">
                    <span className="label">Magic Key:</span>{" "}
                    {climateIndexes.attributes.magicKey}
                  </p>
                )}

                <div className="index-details">
                  <p>
                    <span className="label">DCDBT:</span>
                    <span>{climateIndexes?.attributes?.DCDBT}</span>
                  </p>

                  <p>
                    <span className="label">DCWBT:</span>
                    <span>{climateIndexes?.attributes?.DCWBT}</span>
                  </p>

                  <p>
                    <span className="label">DHDBT:</span>
                    <span>{climateIndexes?.attributes?.DHDBT}</span>
                  </p>

                  <p>
                    <span className="label">HDD_Below_18C:</span>
                    <span>{climateIndexes?.attributes?.HDD_Below_18C}</span>
                  </p>

                  <p>
                    <span className="label">Latitude:</span>
                    <span>{climateIndexes?.attributes?.Latitude}</span>
                  </p>
                </div>

                {/* {Object.keys(climateIndexes.attributes)
              .filter((key) => key !== "OBJECTID" && key !== "Shape")
              .map((key) => (
                <div
                  style={{
                    padding: "1rem",
                    border: "1px solid black",
                    borderRadius: "5px",
                  }}
                  key={key}
                >
                  {key}: {climateIndexes.attributes[key]}
                </div>
              ))} */}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RightSizingLocationLookup;
