// components/ModelSelector.tsx - AI Model Selection

import { useState } from 'react'

interface ModelOption {
  id: string
  name: string
  description: string
  provider: string
  speed: 'fast' | 'medium' | 'slow'
  quality: 'good' | 'better' | 'best'
}

const AVAILABLE_MODELS: ModelOption[] = [
  // Only the 2 working models
  {
    id: 'together-meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    name: 'Llama 3.3 70B (Free)',
    description: 'Fast, capable model for general conversations',
    provider: 'Together AI',
    speed: 'fast',
    quality: 'better'
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Latest Google model with advanced capabilities',
    provider: 'Google',
    speed: 'medium',
    quality: 'best'
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
  locked?: boolean  // New: indicates if model is locked
  lockReason?: string  // New: reason why it's locked
}

export const ModelSelector = ({ selectedModel, onModelChange, disabled, locked, lockReason }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const currentModel = AVAILABLE_MODELS.find(m => m.id === selectedModel) || AVAILABLE_MODELS[0]

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'slow': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'better': return 'text-purple-600 bg-purple-100'
      case 'best': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const isDisabled = disabled || locked

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        disabled={isDisabled}
        className={`
          flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          ${locked ? 'bg-gray-50 border-gray-400' : 'hover:bg-gray-50'}
          ${isOpen && !isDisabled ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        title={locked ? lockReason || 'Model locked for this chat' : 'Select AI Model'}
      >
        <div className="flex items-center space-x-2">
          {locked ? (
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          ) : (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
          <span className="text-sm font-medium">{currentModel.name}</span>
          {locked && (
            <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        {!locked && (
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && !isDisabled && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Select AI Model</h3>
            <p className="text-xs text-gray-600 mt-1">Choose the model for this conversation</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id)
                  setIsOpen(false)
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  ${selectedModel === model.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{model.name}</span>
                      {selectedModel === model.id && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{model.provider}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSpeedColor(model.speed)}`}>
                        {model.speed}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getQualityColor(model.quality)}`}>
                        {model.quality}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Note:</span> Model will be locked after first message
            </p>
          </div>
        </div>
      )}
      
      {isOpen && !isDisabled && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}