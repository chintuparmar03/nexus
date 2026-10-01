import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomSkillNode } from './CustomSkillNode';
import { NodeDrawer } from './NodeDrawer';
import { api } from '../../services/api';
import { Search, Filter, Sparkles, RefreshCw, ZoomIn, Layers } from 'lucide-react';

export const SkillGraphCanvas: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rawTopology, setRawTopology] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ skillNode: CustomSkillNode }), []);

  const fetchTopology = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/skills/topology');
      if (res.data.success) {
        setRawTopology(res.data);
      }
    } catch (err) {
      console.warn('Topology fetch fallback');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopology();
  }, [fetchTopology]);

  // Filter topology whenever filter state changes
  useEffect(() => {
    if (!rawTopology) return;

    let filteredNodes = rawTopology.nodes.map((n: any) => ({ ...n }));
    let filteredEdges = rawTopology.edges.map((e: any) => ({ ...e }));

    if (selectedCategory !== 'All') {
      filteredNodes = filteredNodes.filter((n: any) => n.data.category === selectedCategory);
    }

    if (selectedStatus !== 'All') {
      filteredNodes = filteredNodes.filter((n: any) => n.data.status === selectedStatus);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filteredNodes = filteredNodes.filter(
        (n: any) => n.data.name.toLowerCase().includes(q) || n.data.category.toLowerCase().includes(q)
      );
    }

    const nodeIds = new Set(filteredNodes.map((n: any) => n.id));
    filteredEdges = filteredEdges.filter((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target));

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [rawTopology, selectedCategory, selectedStatus, searchQuery, setNodes, setEdges]);

  const onNodeClick = (_: any, node: any) => {
    setSelectedSkillId(node.id);
  };

  const categories = [
    'All',
    'Programming',
    'Frontend',
    'Backend',
    'Databases',
    'Cloud',
    'DevOps',
    'AI',
    'Data Science',
    'Cyber Security',
    'Soft Skills'
  ];

  return (
    <div className="relative w-full h-[calc(100vh-61px)] bg-[#09090b] overflow-hidden flex flex-col">
      {/* Top Filter Bar Header */}
      <div className="absolute top-4 left-4 right-4 z-30 glass-panel border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        {/* Left: Search & Category */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graph nodes..."
              className="w-full bg-slate-900 border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {['All', 'Mastered', 'In Progress', 'Target'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatus === st ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Right Stats Badge */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> {nodes.length} Nodes
          </span>
          <button
            onClick={fetchTopology}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
            title="Refresh Graph"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs font-mono animate-pulse">
          Computing Graph Directed Edges & Topological Positioning...
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          className="bg-[#09090b]"
        >
          <Background color="#27272a" variant={BackgroundVariant.Dots} gap={24} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node: any) => {
              if (node.data?.status === 'Mastered') return '#10b981';
              if (node.data?.status === 'In Progress') return '#6366f1';
              if (node.data?.status === 'Target') return '#06b6d4';
              return '#27272a';
            }}
            maskColor="rgba(9, 9, 11, 0.7)"
          />
        </ReactFlow>
      )}

      {/* Interactive Side Drawer Panel */}
      <NodeDrawer
        skillId={selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
        onSkillUpdated={fetchTopology}
      />
    </div>
  );
};
