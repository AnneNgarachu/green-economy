'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestConnection() {
  const [isConnected, setIsConnected] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test the connection by fetching a row
        const { data, error } = await supabase
          .from('metrics')
          .select('*')
          .limit(1)
        
        if (error) throw error
        
        setIsConnected(true)
        setData(data)
      } catch (err: any) {
        setError(err.message)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      {error ? (
        <div className="text-red-500">
          Error: {error}
        </div>
      ) : isConnected ? (
        <div className="text-green-500">
          ✓ Connected to Supabase!
          {data && data.length > 0 && (
            <div className="mt-4">
              <p className="font-bold">Sample data:</p>
              <pre className="bg-gray-100 p-2 mt-2 rounded overflow-x-auto">
                {JSON.stringify(data[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="text-blue-500">
          Testing connection...
        </div>
      )}
    </div>
  )
}