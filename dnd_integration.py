import asyncio
import aiohttp
from typing import Dict, List, Any, Optional

class DnDIntegration:
    def __init__(self):
        self.base_url = "https://www.dnd5eapi.co/api"
        self.session = None

    async def _get_session(self):
        """Get or create aiohttp session."""
        if self.session is None:
            self.session = aiohttp.ClientSession()
        return self.session

    async def close(self):
        """Close the aiohttp session."""
        if self.session:
            await self.session.close()
            self.session = None

    async def _make_request(self, endpoint: str) -> Dict[str, Any]:
        """Make a request to the D&D 5E API."""
        session = await self._get_session()
        
        try:
            async with session.get(f"{self.base_url}/{endpoint}") as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"D&D API request failed with status {response.status}")
        except aiohttp.ClientError as e:
            raise Exception(f"Failed to connect to D&D API: {str(e)}")

    async def get_spells(self) -> List[Dict[str, Any]]:
        """Get list of all spells."""
        try:
            data = await self._make_request("spells")
            return data.get("results", [])
        except Exception as e:
            raise Exception(f"Failed to fetch spells: {str(e)}")

    async def get_spell_details(self, spell_index: str) -> Dict[str, Any]:
        """Get detailed information about a specific spell."""
        try:
            return await self._make_request(f"spells/{spell_index}")
        except Exception as e:
            raise Exception(f"Failed to fetch spell details for {spell_index}: {str(e)}")

    async def get_monsters(self) -> List[Dict[str, Any]]:
        """Get list of all monsters."""
        try:
            data = await self._make_request("monsters")
            return data.get("results", [])
        except Exception as e:
            raise Exception(f"Failed to fetch monsters: {str(e)}")

    async def get_monster_details(self, monster_index: str) -> Dict[str, Any]:
        """Get detailed information about a specific monster."""
        try:
            return await self._make_request(f"monsters/{monster_index}")
        except Exception as e:
            raise Exception(f"Failed to fetch monster details for {monster_index}: {str(e)}")

    async def get_classes(self) -> List[Dict[str, Any]]:
        """Get list of all character classes."""
        try:
            data = await self._make_request("classes")
            return data.get("results", [])
        except Exception as e:
            raise Exception(f"Failed to fetch classes: {str(e)}")

    async def get_class_details(self, class_index: str) -> Dict[str, Any]:
        """Get detailed information about a specific class."""
        try:
            return await self._make_request(f"classes/{class_index}")
        except Exception as e:
            raise Exception(f"Failed to fetch class details for {class_index}: {str(e)}")

    async def get_races(self) -> List[Dict[str, Any]]:
        """Get list of all character races."""
        try:
            data = await self._make_request("races")
            return data.get("results", [])
        except Exception as e:
            raise Exception(f"Failed to fetch races: {str(e)}")

    async def get_race_details(self, race_index: str) -> Dict[str, Any]:
        """Get detailed information about a specific race."""
        try:
            return await self._make_request(f"races/{race_index}")
        except Exception as e:
            raise Exception(f"Failed to fetch race details for {race_index}: {str(e)}")

    async def get_equipment(self) -> List[Dict[str, Any]]:
        """Get list of all equipment."""
        try:
            data = await self._make_request("equipment")
            return data.get("results", [])
        except Exception as e:
            raise Exception(f"Failed to fetch equipment: {str(e)}")

    async def get_equipment_details(self, equipment_index: str) -> Dict[str, Any]:
        """Get detailed information about specific equipment."""
        try:
            return await self._make_request(f"equipment/{equipment_index}")
        except Exception as e:
            raise Exception(f"Failed to fetch equipment details for {equipment_index}: {str(e)}")

    async def search_by_name(self, category: str, name: str) -> Optional[Dict[str, Any]]:
        """Search for an item by name in a specific category."""
        try:
            # Get all items in category
            data = await self._make_request(category)
            results = data.get("results", [])
            
            # Find item by name (case-insensitive)
            for item in results:
                if item.get("name", "").lower() == name.lower():
                    return item
            
            return None
        except Exception as e:
            raise Exception(f"Failed to search for {name} in {category}: {str(e)}")

    async def get_random_monsters_by_cr(self, challenge_rating: float, count: int = 1) -> List[Dict[str, Any]]:
        """Get random monsters of a specific challenge rating."""
        try:
            # Get all monsters
            monsters = await self.get_monsters()
            
            # Filter by challenge rating (this would need monster details to be accurate)
            # For now, return random monsters from the list
            import random
            selected = random.sample(monsters, min(count, len(monsters)))
            
            # Get details for selected monsters
            monster_details = []
            for monster in selected:
                try:
                    details = await self.get_monster_details(monster["index"])
                    if details.get("challenge_rating") == challenge_rating:
                        monster_details.append(details)
                except:
                    continue
                    
                if len(monster_details) >= count:
                    break
            
            return monster_details
        except Exception as e:
            raise Exception(f"Failed to get random monsters: {str(e)}")

    def __del__(self):
        """Cleanup when object is destroyed."""
        if self.session and not self.session.closed:
            # Note: In a real application, you should properly close the session
            # This is just a safety measure
            try:
                asyncio.create_task(self.close())
            except:
                pass
