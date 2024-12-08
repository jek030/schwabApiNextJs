'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from './components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type Todo = {
  id: number;
  note: string;
  created_at: string;
  complete: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Fetch todos from Supabase
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        console.log('Fetching todos...');
        const { data, error } = await supabase
          .from('todolist')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log('Fetched data:', data);
        setTodos(data || []);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const { data, error } = await supabase
          .from('todolist')
          .insert([{ 
            note: newTodo.trim(),
            complete: false 
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setTodos([data, ...todos]);
          setNewTodo('');
        }
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todolist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const saveEdit = async (id: number) => {
    if (editingText.trim()) {
      try {
        const { error } = await supabase
          .from('todolist')
          .update({ note: editingText.trim() })
          .eq('id', id);

        if (error) throw error;
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, note: editingText.trim() } : todo
        ));
        setEditingId(null);
        setEditingText('');
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    }
  };

  const toggleComplete = async (id: number, currentComplete: boolean) => {
    try {
      const { error } = await supabase
        .from('todolist')
        .update({ complete: !currentComplete })
        .eq('id', id);

      if (error) throw error;
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, complete: !todo.complete } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingId !== null) {
        saveEdit(editingId);
      } else {
        addTodo();
      }
    } else if (e.key === 'Escape' && editingId !== null) {
      setEditingId(null);
      setEditingText('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <PageHeader>
          This is the home page.
        </PageHeader>
        <Card>
          <CardHeader>
            <CardTitle>Loading notes...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <PageHeader>
        This is the home page.
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 md:text-2xl flex justify-between items-center">
            Todo List
            <div className="flex items-center gap-2">
              <Input 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a new todo"
                className="w-full max-w-md"
              />
              <Button 
                onClick={addTodo} 
                variant="outline" 
                size="icon"
                disabled={!newTodo.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-6">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center">No todos yet. Add a new todo!</p>
          ) : (
            <ul className="list-inside list-decimal text-left font-[family-name:var(--font-geist-mono)]"> 
              {todos.map((todo) => (
                <li 
                  key={todo.id} 
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  {editingId === todo.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button 
                          onClick={() => saveEdit(todo.id)}
                          variant="ghost" 
                          size="icon"
                          className="text-green-500 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => {
                            setEditingId(null);
                            setEditingText('');
                          }}
                          variant="ghost" 
                          size="icon"
                          className="text-gray-500 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.complete}
                          onChange={() => toggleComplete(todo.id, todo.complete)}
                          className="w-4 h-4"
                        />
                        <span className={todo.complete ? 'line-through text-gray-500' : ''}>
                          {todo.note}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          onClick={() => {
                            setEditingId(todo.id);
                            setEditingText(todo.note);
                          }}
                          variant="ghost" 
                          size="icon"
                          className="text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteTodo(todo.id)} 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          <Link 
            href="/accounts"
            className="border border-slate-300 mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 self-start"
          >
            Click here to view your accounts.
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}