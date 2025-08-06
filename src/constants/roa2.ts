/**
 * Rivals of Aether 2 Constants
 */

// Import all character portraits
import ZetterburnPortrait from '@/assets/roa2/characters/RoA2_Zetterburn_Portrait.png';
import OrcanePortrait from '@/assets/roa2/characters/RoA2_Orcane_Portrait.png';
import WrastorPortrait from '@/assets/roa2/characters/RoA2_Wrastor_Portrait.png';
import KraggPortrait from '@/assets/roa2/characters/RoA2_Kragg_Portrait.png';
import ForsburnPortrait from '@/assets/roa2/characters/RoA2_Forsburn_Portrait.png';
import MaypulPortrait from '@/assets/roa2/characters/RoA2_Maypul_Portrait.png';
import AbsaPortrait from '@/assets/roa2/characters/RoA2_Absa_Portrait.png';
import EtalusPortrait from '@/assets/roa2/characters/RoA2_Etalus_Portrait.png';
import RannoPortrait from '@/assets/roa2/characters/RoA2_Ranno_Portrait.png';
import ClairenPortrait from '@/assets/roa2/characters/RoA2_Clairen_Portrait.png';
import SylvanosPortrait from '@/assets/roa2/characters/RoA2_Sylvanos_Portrait.png';
import EllianaPortrait from '@/assets/roa2/characters/RoA2_Elliana_Portrait.png';
import MolloPortrait from '@/assets/roa2/characters/RoA2_Mollo_Portrait.png';
import HodanPortrait from '@/assets/roa2/characters/RoA2_Hodan_Portrait.png';
import PommePortrait from '@/assets/roa2/characters/RoA2_Pomme_Portrait.png';
import OlympiaPortrait from '@/assets/roa2/characters/RoA2_Olympia_Portrait.png';
import FleetPortrait from '@/assets/roa2/characters/RoA2_Fleet_Portrait.png';
import LaReinaPortrait from '@/assets/roa2/characters/RoA2_La_Reina_Portrait.png';
import LoxodontPortrait from '@/assets/roa2/characters/RoA2_Loxodont_Portrait.png';

// Import all stage images
import AetherianForestStage from '@/assets/roa2/stages/AetherianForest.png';
import GodaiDeltaStage from '@/assets/roa2/stages/GodaiDelta.png';
import HodojoStage from '@/assets/roa2/stages/Hodojo.png';
import JulesvaleStage from '@/assets/roa2/stages/Julesvale.png';
import MerchantPortStage from '@/assets/roa2/stages/MerchantPort.png';
import AirArmadaStage from '@/assets/roa2/stages/AirArmada.png';
import FireCapitalStage from '@/assets/roa2/stages/FireCapital.png';
import HyperboreanHarborStage from '@/assets/roa2/stages/HyperboreanHarbor.png';
import RockWallStage from '@/assets/roa2/stages/RockWall.png';
import TempestPeakStage from '@/assets/roa2/stages/TempestPeak.png';
import ForestUnderstoryStage from '@/assets/roa2/stages/ForestUnderstory.png';
import StormsweptPillarStage from '@/assets/roa2/stages/StormsweptPillar.png';

import type { Rival, Stage, RivalElement } from '@/types/roa2Types';

/**
 * List of characters with their elements and icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const RIVALS: Rival[] = [
	{
		name: 'Zetterburn',
		element: 'Fire',
		iconPath: ZetterburnPortrait,
		color: '#FFD700',
	},
	{
		name: 'Orcane',
		element: 'Water',
		iconPath: OrcanePortrait,
		color: '#FF1493',
	},
	{
		name: 'Wrastor',
		element: 'Air',
		iconPath: WrastorPortrait,
		color: '#00FFFF',
	},
	{
		name: 'Kragg',
		element: 'Earth',
		iconPath: KraggPortrait,
		color: '#0000FF',
	},
	{
		name: 'Forsburn',
		element: 'Fire',
		iconPath: ForsburnPortrait,
		color: '#008000',
	},
	{
		name: 'Maypul',
		element: 'Earth',
		iconPath: MaypulPortrait,
		color: '#EE82EE',
	},
	{
		name: 'Absa',
		element: 'Air',
		iconPath: AbsaPortrait,
		color: '#B0E0E6',
	},
	{
		name: 'Etalus',
		element: 'Water',
		iconPath: EtalusPortrait,
		color: '#FFA500',
	},
	{
		name: 'Ranno',
		element: 'Water',
		iconPath: RannoPortrait,
		color: '#FF4500',
	},
	{
		name: 'Clairen',
		element: 'Fire',
		iconPath: ClairenPortrait,
		color: '#FF0000',
	},
	// {
	// 	name: 'Sylvanos',
	// 	element: 'Earth',
	// 	iconPath: SylvanosPortrait,
	// 	color: '#228B22',
	// },
	// {
	// 	name: 'Elliana',
	// 	element: 'Air',
	// 	iconPath: EllianaPortrait,
	// 	color: '#B0E0E6',
	// },
	// {
	// 	name: 'Mollo',
	// 	element: 'Fire',
	// 	iconPath: MolloPortrait,
	// 	color: '#A0522D',
	// },
	// {
	// 	name: 'Hodan',
	// 	element: 'Earth',
	// 	iconPath: HodanPortrait,
	// 	color: '#8B4513',
	// },
	// {
	// 	name: 'Pomme',
	// 	element: 'Air',
	// 	iconPath: PommePortrait,
	// 	color: '#FF69B4',
	// },
	{
		name: 'Olympia',
		element: 'Water',
		iconPath: OlympiaPortrait,
		color: '#FF00FF',
	},
	{
		name: 'Loxodont',
		element: 'Earth',
		iconPath: LoxodontPortrait,
		color: '#4B0082',
	},
	{
		name: 'Fleet',
		element: 'Air',
		iconPath: FleetPortrait,
		color: '#FFFF00',
	},
	// {
	// 	name: 'La Reina',
	// 	element: 'Fire',
	// 	iconPath: LaReinaPortrait,
	// 	color: '#C71585',
	// },
]

/**
 * List of stages with their icon paths.
 * The icon paths are relative to the `public` directory.
 */
export const STAGES: Stage[] = [
	{
		name: 'Aetherian Forest',
		iconPath: AetherianForestStage,
	},
	{
		name: 'Godai Delta',
		iconPath: GodaiDeltaStage,
	},
	{
		name: 'Hodojo',
		iconPath: HodojoStage,
	},
	{
		name: 'Julesvale',
		iconPath: JulesvaleStage,
	},
	{
		name: 'Merchant Port',
		iconPath: MerchantPortStage,
	},
	{
		name: 'Air Armada',
		iconPath: AirArmadaStage,
	},
	{
		name: 'Fire Capital',
		iconPath: FireCapitalStage,
	},
	{
		name: 'Hyperborean Harbor',
		iconPath: HyperboreanHarborStage,
	},
	{
		name: 'Rock Wall',
		iconPath: RockWallStage,
	},
	{
		name: 'Tempest Peak',
		iconPath: TempestPeakStage,
	},
	{
		name: 'Forest Understory',
		iconPath: ForestUnderstoryStage,
	},
	{
		name: 'Stormswept Pillar',
		iconPath: StormsweptPillarStage,
	},
]

/** List of all rival elements */
export const RIVAL_ELEMENTS: readonly RivalElement[] = ['Fire', 'Water', 'Air', 'Earth'] as const;

/** List of all rival names */
export const RIVAL_NAMES = RIVALS.map(rival => rival.name);

/** List of all stage names */
export const STAGE_NAMES = STAGES.map(stage => stage.name);
