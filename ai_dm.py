import json
import os
from typing import Dict, List, Optional, Any
from openai import OpenAI

class AIDungeonMaster:
    def __init__(self):
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        self.model = "gpt-4o"
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # System prompt for the AI DM
        self.system_prompt = """You are an expert Dungeon Master for D&D 5th Edition. You are creative, engaging, and follow the rules of D&D 5E. Your role is to:

1. Create immersive storytelling experiences
2. Respond to player actions with appropriate consequences
3. Guide the narrative while allowing player agency
4. Provide clear descriptions of scenes, NPCs, and encounters
5. Handle combat, skill checks, and other game mechanics
6. Suggest actions when players seem stuck
7. Maintain game balance and ensure everyone has fun

Always respond in character as a DM. Be descriptive but concise. Ask for dice rolls when appropriate. Provide multiple options for player actions when helpful.

When generating responses, consider:
- The character's background, class, and personality
- The current game session context
- Previous conversation history
- D&D 5E rules and mechanics

Format your responses in a natural, engaging way that moves the story forward."""

    async def generate_response(
        self, 
        message: str, 
        character: Optional[Dict[str, Any]] = None,
        game_session: Optional[Dict[str, Any]] = None,
        chat_history: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate an AI DM response to player input."""
        
        try:
            # Build context from character and session
            context = self._build_context(character, game_session, chat_history or [])
            
            # Create messages for the API call
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "system", "content": f"Context: {context}"},
                {"role": "user", "content": message}
            ]
            
            # Add recent chat history
            if chat_history:
                for msg in chat_history[-5:]:  # Last 5 messages for context
                    if msg.get('type') == 'player':
                        messages.insert(-1, {"role": "user", "content": msg.get('content', '')})
                    elif msg.get('type') == 'dm':
                        messages.insert(-1, {"role": "assistant", "content": msg.get('content', '')})
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=800,
                temperature=0.8
            )
            
            dm_response = response.choices[0].message.content
            
            # Generate action suggestions
            suggestions = await self._generate_suggestions(message, character, dm_response)
            
            return {
                "message": dm_response,
                "suggestions": suggestions
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate AI response: {str(e)}")

    async def generate_encounter(self, party_level: int, party_size: int) -> Dict[str, Any]:
        """Generate a random encounter for the party."""
        
        try:
            prompt = f"""Generate a random D&D 5E encounter for a party of {party_size} characters at level {party_level}. 
            
            Provide a JSON response with:
            - description: A vivid description of the encounter scenario
            - monsters: List of monsters with their names and challenge ratings
            - difficulty: "easy", "medium", "hard", or "deadly"
            - setting: Where this encounter takes place
            - tactics: How the monsters might behave in combat
            
            Make it engaging and appropriate for the party's level."""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a D&D 5E encounter designer. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=600,
                temperature=0.9
            )
            
            encounter_data = json.loads(response.choices[0].message.content)
            
            return {
                "description": encounter_data.get("description", "A mysterious encounter awaits..."),
                "monsters": encounter_data.get("monsters", []),
                "difficulty": encounter_data.get("difficulty", "medium"),
                "setting": encounter_data.get("setting", "Unknown location"),
                "tactics": encounter_data.get("tactics", "The monsters fight to the death")
            }
            
        except Exception as e:
            raise Exception(f"Failed to generate encounter: {str(e)}")

    async def _generate_suggestions(
        self, 
        player_message: str, 
        character: Optional[Dict[str, Any]], 
        dm_response: str
    ) -> List[str]:
        """Generate action suggestions for the player."""
        
        try:
            prompt = f"""Based on this D&D scenario:
            Player said: "{player_message}"
            DM responded: "{dm_response}"
            Character class: {character.get('class', 'Unknown') if character else 'Unknown'}
            
            Suggest 3 brief action options the player could take next. Each should be 1-2 words maximum.
            Respond with JSON: {{"suggestions": ["action1", "action2", "action3"]}}"""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "Generate brief D&D action suggestions. Respond only with JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=100,
                temperature=0.7
            )
            
            suggestions_data = json.loads(response.choices[0].message.content)
            return suggestions_data.get("suggestions", [])
            
        except Exception:
            # Return default suggestions if AI generation fails
            return ["Investigate", "Attack", "Negotiate"]

    def _build_context(
        self, 
        character: Optional[Dict[str, Any]], 
        game_session: Optional[Dict[str, Any]], 
        chat_history: List[Dict[str, Any]]
    ) -> str:
        """Build context string from character and session data."""
        
        context_parts = []
        
        if character:
            context_parts.append(f"Character: {character.get('name', 'Unknown')} - Level {character.get('level', 1)} {character.get('race', '')} {character.get('class', '')}")
            if character.get('backstory'):
                context_parts.append(f"Background: {character['backstory'][:200]}...")
        
        if game_session:
            if game_session.get('name'):
                context_parts.append(f"Session: {game_session['name']}")
            if game_session.get('currentScene'):
                context_parts.append(f"Current Scene: {game_session['currentScene']}")
            if game_session.get('notes'):
                context_parts.append(f"Notes: {game_session['notes'][-300:]}...")
        
        return " | ".join(context_parts) if context_parts else "New adventure beginning"
