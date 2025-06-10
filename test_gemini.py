#!/usr/bin/env python3
"""
Test script to verify Google Gemini API is working and list available models
"""
import os
import google.generativeai as genai

def test_gemini_api():
    try:
        # Get API key
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            api_key = "YOUR_GOOGLE_API_KEY_HERE"  # Replace with your actual API key
        
        if not api_key or api_key == "YOUR_GOOGLE_API_KEY_HERE":
            print("❌ Error: Please set your Google API key")
            print("Set environment variable: export GOOGLE_API_KEY='your_key_here'")
            print("Or replace 'YOUR_GOOGLE_API_KEY_HERE' in this script with your actual key")
            return False
        
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # List available models
        print("🔍 Listing available models...")
        models = genai.list_models()
        
        available_models = []
        for model in models:
            print(f"📝 Model: {model.name}")
            if hasattr(model, 'supported_generation_methods'):
                print(f"   Supported methods: {model.supported_generation_methods}")
                if 'generateContent' in model.supported_generation_methods:
                    available_models.append(model.name)
            print()
        
        if not available_models:
            print("❌ No models support generateContent")
            return False
        
        # Test with the first available model
        print(f"🧪 Testing with model: {available_models[0]}")
        model = genai.GenerativeModel(available_models[0])
        
        # Test generation
        response = model.generate_content("Say hello and confirm you are Google Gemini")
        
        print("✅ Success! Gemini API is working")
        print(f"📝 Response: {response.text}")
        print(f"🎯 Available models that work: {available_models}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\nPossible issues:")
        print("1. Invalid API key")
        print("2. Network connection problems")
        print("3. API quota exceeded")
        print("4. Model name changed - check available models above")
        return False

if __name__ == "__main__":
    test_gemini_api()