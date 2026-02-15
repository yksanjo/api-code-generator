'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, Download, FileCode, Braces, Terminal, FileJson, Box, Database, Server } from 'lucide-react';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: Braces, color: 'bg-yellow-500' },
  { id: 'python', name: 'Python', icon: Terminal, color: 'bg-blue-500' },
  { id: 'curl', name: 'cURL', icon: FileJson, color: 'bg-slate-500' },
  { id: 'ruby', name: 'Ruby', icon: Box, color: 'bg-red-500' },
  { id: 'go', name: 'Go', icon: Server, color: 'bg-cyan-500' },
  { id: 'java', name: 'Java', icon: Database, color: 'bg-orange-500' },
];

const sampleApis = [
  { name: 'JSONPlaceholder', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1' },
  { name: 'Cat Facts', method: 'GET', url: 'https://catfact.ninja/fact' },
  { name: 'Create Post', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts', body: '{"title":"foo","body":"bar","userId":1}' },
];

function generateCode(lang: string, method: string, url: string, body?: string): string {
  const cleanUrl = url.replace(/^https?:\/\//, '');
  
  switch (lang) {
    case 'javascript':
      return `const response = await fetch('${url}', {
  method: '${method}',
  headers: {
    'Content-Type': 'application/json',
  },${body ? `\n  body: JSON.stringify(${body}),` : ''}
});

const data = await response.json();
console.log(data);`;

    case 'python':
      return `import requests

response = requests.${method.toLowerCase()}(
    '${url}',
    headers={'Content-Type': 'application/json'},${body ? `\n    json=${body}` : ''}
)

print(response.json())`;

    case 'curl':
      return `curl -X ${method} '${url}' \\
  -H 'Content-Type: application/json'${body ? ` \\
  -d '${body}'` : ''}`;

    case 'ruby':
      return `require 'net/http'
require 'json'

uri = URI('${url}')
http = Net::HTTP.new(uri.host, uri.port)

request = Net::HTTP::${method}.new(uri.path)
request['Content-Type'] = 'application/json'${body ? `\nrequest.body = '${body}'` : ''}

response = http.request(request)
puts JSON.parse(response.body)`;

    case 'go':
      return `package main

import (
	"bytes"
	"fmt"
	"net/http"
)

func main() {
${body ? `\tdata := bytes.NewBufferString(\`${body}\`)` : '\tdata := bytes.NewBufferString("")'}
	req, _ := http.NewRequest("${method}", "${url}", data)
	req.Header.Add("Content-Type", "application/json")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	fmt.Println("Response Status:", resp.Status)
}`;

    case 'java':
      return `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Main {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("${url}"))
            .method("${method}", HttpRequest.BodyPublishers.ofString(${body || '""'}))
            .header("Content-Type", "application/json")
            .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
    }
}`;

    default:
      return '// Select a language to generate code';
  }
}

export default function CodeGenerator() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [body, setBody] = useState('');
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const code = generateCode(selectedLang, method, url, body || undefined);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js', python: 'py', curl: 'sh', ruby: 'rb', go: 'go', java: 'java'
    };
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `api-client.${extensions[selectedLang]}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-purple-400" />
            <h1 className="text-xl font-bold">API Code Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FileCode className="w-4 h-4" /> API Endpoint</h3>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 font-mono font-bold focus:outline-none focus:border-purple-500"
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <h3 className="font-semibold mb-3">Sample APIs</h3>
            <div className="space-y-2">
              {sampleApis.map((api, i) => (
                <button
                  key={i}
                  onClick={() => { setMethod(api.method); setUrl(api.url); if (api.body) setBody(api.body); }}
                  className="w-full text-left p-3 bg-slate-900 rounded hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500">{api.method}</span>
                    <span className="text-sm font-medium">{api.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedLang === lang.id 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <lang.icon className="w-4 h-4" />
                    {lang.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={copyCode} className="p-2 text-slate-400 hover:text-white">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={downloadCode} className="p-2 text-slate-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <motion.pre
              key={code}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 overflow-auto max-h-[500px] text-sm font-mono"
            >
              <code className="text-purple-300">{code}</code>
            </motion.pre>
          </div>
        </div>
      </main>
    </div>
  );
}
