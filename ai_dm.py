import json
import os
from typing import Dict, List, Optional, Any
import google.generativeai as genai

class AIDungeonMaster:
    def __init__(self):
        # Configure Google Gemini
        # Option 1: Use environment variable (recommended)
        api_key = os.getenv("GOOGLE_API_KEY")
        
        # Option 2: Put your API key directly here (less secure)
        if not api_key:
            api_key = "AIzaSyBCAfXLrErxnxlsaF1jM8dS0FHtwY4LnJI"  
        
        if not api_key or api_key == "YOUR_GOOGLE_API_KEY_HERE":
            raise ValueError("Please set your Google API key either as GOOGLE_API_KEY environment variable or directly in the code")
        
        genai.configure(api_key=api_key)
        
        # Use the current recommended model as suggested by Google
        print("[INFO] Initializing Gemini model...")
        try:
            # Try gemini-1.5-flash first (recommended by Google)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            print("[INFO] Using model: gemini-1.5-flash")
        except Exception as e1:
            print(f"[WARNING] gemini-1.5-flash failed: {e1}")
            try:
                # Fallback to gemini-1.5-pro
                self.model = genai.GenerativeModel('gemini-1.5-pro')
                print("[INFO] Using model: gemini-1.5-pro")
            except Exception as e2:
                print(f"[WARNING] gemini-1.5-pro failed: {e2}")
                try:
                    # Try without the version number
                    self.model = genai.GenerativeModel('gemini-flash')
                    print("[INFO] Using model: gemini-flash")
                except Exception as e3:
                    print(f"[WARNING] gemini-flash failed: {e3}")
                    raise Exception(f"Could not initialize any Gemini model. Errors: {e1}, {e2}, {e3}")
        
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

    def generate_response(
        self, 
        message: str, 
        character: Optional[Dict[str, Any]] = None,
        game_session: Optional[Dict[str, Any]] = None,
        chat_history: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Generate an AI DM response to player input."""
        
        try:
            print(f"[DEBUG] Generating response for message: {message[:50]}...")
            
            # Build context from character and session
            context = self._build_context(character, game_session, chat_history or [])
            
            # Create the full prompt
            full_prompt = f"{self.system_prompt}\n\nContext: {context}\n\nPlayer message: {message}\n\nRespond as the Dungeon Master:"
            
            # Add recent chat history to the prompt
            if chat_history:
                history_text = "\n\nRecent conversation:\n"
                for msg in chat_history[-5:]:  # Last 5 messages for context
                    if msg.get('type') == 'player':
                        history_text += f"Player: {msg.get('content', '')}\n"
                    elif msg.get('type') == 'dm':
                        history_text += f"DM: {msg.get('content', '')}\n"
                full_prompt = full_prompt.replace("Player message:", f"{history_text}\nPlayer message:")
            
            print("[DEBUG] Calling Gemini API...")
            
            # Generate response using Gemini
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=800,
                    temperature=0.8,
                    top_p=0.8,
                    top_k=40
                )
            )
            
            print("[DEBUG] Gemini API response received")
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            dm_response = response.text.strip()
            
            # Generate action suggestions
            suggestions = self._generate_suggestions(message, character, dm_response)
            
            print(f"[DEBUG] Response generated successfully: {dm_response[:50]}...")
            
            return {
                "message": dm_response,
                "suggestions": suggestions
            }
            
        except Exception as e:
            print(f"[ERROR] Failed to generate AI response: {str(e)}")
            print(f"[ERROR] Exception type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            raise Exception(f"Failed to generate AI response: {str(e)}")

    def generate_encounter(self, party_level: int, party_size: int) -> Dict[str, Any]:
        """Generate a random encounter for the party."""
        
        try:
            print(f"[DEBUG] Generating encounter for level {party_level}, party size {party_size}")
            
            prompt = f"""Generate a random D&D 5E encounter for a party of {party_size} characters at level {party_level}. 

Provide a JSON response with the following structure:
{{
    "description": "A vivid description of the encounter scenario",
    "monsters": [
        {{"name": "Monster Name", "challenge_rating": "CR value"}}
    ],
    "difficulty": "easy/medium/hard/deadly",
    "setting": "Where this encounter takes place",
    "tactics": "How the monsters might behave in combat"
}}

Make it engaging and appropriate for the party's level. Respond only with valid JSON."""
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=600,
                    temperature=0.9,
                )
            )
            
            if not response or not response.text:
                raise Exception("Empty response from Gemini API")
            
            # Try to parse the JSON response
            try:
                encounter_data = json.loads(response.text)
            except json.JSONDecodeError as je:
                print(f"[WARNING] JSON parsing failed: {je}")
                print(f"[WARNING] Raw response: {response.text}")
                # If JSON parsing fails, create a fallback response
                encounter_data = {
                    "description": response.text,
                    "monsters": [{"name": "Unknown", "challenge_rating": "1"}],
                    "difficulty": "medium",
                    "setting": "Unknown location",
                    "tactics": "The monsters fight to the death"
                }
            
            return {
                "description": encounter_data.get("description", "A mysterious encounter awaits..."),
                "monsters": encounter_data.get("monsters", []),
                "difficulty": encounter_data.get("difficulty", "medium"),
                "setting": encounter_data.get("setting", "Unknown location"),
                "tactics": encounter_data.get("tactics", "The monsters fight to the death")
            }
            
        except Exception as e:
            print(f"[ERROR] Failed to generate encounter: {str(e)}")
            raise Exception(f"Failed to generate encounter: {str(e)}")

    def _generate_suggestions(
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
Respond with only a JSON array like: ["action1", "action2", "action3"]"""
            
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=100,
                    temperature=0.7,
                )
            )
            
            if response and response.text:
                try:
                    suggestions = json.loads(response.text)
                    if isinstance(suggestions, list):
                        return suggestions[:3]  # Ensure we only return 3 suggestions
                except json.JSONDecodeError:
                    pass
            
            # Return default suggestions if parsing fails
            return ["Investigate", "Attack", "Negotiate"]
            
        except Exception as e:
            print(f"[WARNING] Failed to generate suggestions: {str(e)}")
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