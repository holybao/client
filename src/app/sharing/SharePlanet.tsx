import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import {
  isLocatable,
  LocationId,
  Planet,
} from '../../_types/global/GlobalTypes';
import { PlanetScape } from '../planetscape/PlanetScape';
import { getPlanetShortHash } from '../../utils/Utils';
import { ProcgenUtils } from '../../utils/ProcgenUtils';
import dfstyles from '../../styles/dfstyles';
import { Sub } from '../../components/Text';
import { Share } from './Share';
import ReaderDataStore from '../../api/ReaderDataStore';

const PlanetCard = styled.div`
  width: 36em;
  margin: 2em auto;
  font-size: 14pt;
  z-index: 1000;
  background: ${dfstyles.colors.background};
  border-radius: 3px;
  border: 1px solid ${dfstyles.colors.text};

  & > div {
    width: 100%;
    padding: 0.5em;
    &:nth-child(1) {
      // header
      border-bottom: 1px solid ${dfstyles.colors.subtext};
    }
    &:nth-child(2) {
      // scape
      height: 350px;
    }
  }
`;

interface SharePlanetData {
  planet: Planet;
  biome: number | null;
  ownerTwitter: string | null;
}

export function SharePlanet({
  match,
}: RouteComponentProps<{ locationId: LocationId }>) {
  async function load(dataStore: ReaderDataStore): Promise<SharePlanetData> {
    const loadedPlanet = await dataStore.loadPlanetFromContract(
      match.params.locationId
    );

    return {
      planet: loadedPlanet,
      biome: isLocatable(loadedPlanet) ? loadedPlanet.biome : null,
      ownerTwitter: dataStore.getTwitter(loadedPlanet?.owner) || null,
    };
  }

  return (
    <Share load={load}>
      {(
        data: SharePlanetData | undefined,
        loading: boolean,
        error: Error | undefined
      ) => {
        if (loading) {
          return 'loading';
        }

        if (error || !data) {
          return 'error';
        }

        return (
          <PlanetCard>
            <div>
              {getPlanetShortHash(data.planet)}{' '}
              {ProcgenUtils.getPlanetName(data.planet)}
            </div>
            <div>
              <PlanetScape
                planet={data.planet}
                info={null}
                keepDrawing={true}
              />
            </div>
            <div>
              <p>
                <em>{ProcgenUtils.getPlanetTagline(data.planet)}...</em>
                <span>
                  <Sub>{ProcgenUtils.getPlanetBlurb(data.planet)}</Sub>
                </span>
              </p>
              <p>{`Owner: ${data.ownerTwitter || data.planet.owner}`}</p>
              <p>{`Energy: ${data.planet.energy}`}</p>
              <p>{`Biome: ${data.biome || 'unknown'}`}</p>
              <p>
                Find this planet in-game at <a href='/'>http://zkga.me</a> to
                read more!
              </p>
            </div>
          </PlanetCard>
        );
      }}
    </Share>
  );
}
