'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from './components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { Input } from '@/app/ui/input';
import { Button } from '@/app/ui/button';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog"
import { Label } from "@/app/ui/label"

type Todo = {
  id: number;
  note: string;
  created_at: string;
  complete: boolean;
  priority: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newPriority, setNewPriority] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [updateTimeoutId, setUpdateTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
          .order('priority', { ascending: false })
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
            complete: false,
            priority: newPriority
          }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setTodos([data, ...todos]);
          setNewTodo('');
          setNewPriority(0);
          setIsDialogOpen(false);
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

  const updatePriority = async (id: number, priority: number) => {
    // Immediately update the UI
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));

    // Clear any existing timeout
    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }

    // Set new timeout for database update
    const timeoutId = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('todolist')
          .update({ priority })
          .eq('id', id);

        if (error) throw error;

        // Re-sort todos after successful update
        setTodos(prevTodos => 
          [...prevTodos].sort((a, b) => {
            // Sort by priority first (descending)
            if (b.priority !== a.priority) {
              return b.priority - a.priority;
            }
            // Then by creation date (descending)
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
        );
      } catch (error) {
        console.error('Error updating priority:', error);
        // Optionally revert the change if the update fails
        // You could add error handling here
      }
    }, 500); // 500ms delay

    setUpdateTimeoutId(timeoutId);
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

  // Add cleanup for the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (updateTimeoutId) {
        clearTimeout(updateTimeoutId);
      }
    };
  }, [updateTimeoutId]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="p-6">
          <PageHeader
            title="Welcome to Finance Guy"
            description="This is the home page."
          />
        </div>

        <main className="p-6">
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
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <PageHeader
          title="Welcome to Finance Guy"
          description="This is the home page."
        />
      </div>
      
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 md:text-2xl flex justify-between items-center">
              Todo List
              <div className="flex items-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Todo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Todo</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="todo">Todo</Label>
                        <Input
                          id="todo"
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTodo();
                            }
                          }}
                          placeholder="Enter your todo"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Input
                          id="priority"
                          type="number"
                          min="0"
                          value={newPriority}
                          onChange={(e) => setNewPriority(parseInt(e.target.value) || 0)}
                          placeholder="Enter priority"
                        />
                      </div>
                      <Button onClick={addTodo} className="mt-2">
                        Add Todo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                variant="outline"
                className="text-sm"
              >
                {showCompleted ? 'Hide Completed' : 'Show Completed'}
              </Button>
            </div>

            {todos.length === 0 ? (
              <p className="text-gray-500 text-center">No todos yet. Add a new todo!</p>
            ) : (
              <div className="w-full">
                {/* Column Headers */}
                <div className="flex items-center gap-2 pb-4 border-b font-semibold text-gray-600">
                  <div className="w-16 text-center">Priority</div>
                  <div className="flex-1">Todo</div>
                  <div className="w-20"></div>
                </div>

                {/* Todo List */}
                <ul className="list-none text-left"> 
                  {todos
                    .filter(todo => showCompleted ? true : !todo.complete)
                    .map((todo) => (
                      <li 
                        key={todo.id} 
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        {editingId === todo.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              type="number"
                              value={todo.priority}
                              onChange={(e) => updatePriority(todo.id, parseInt(e.target.value) || 0)}
                              className="w-16"
                              min="0"
                            />
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
                              <Input
                                type="number"
                                value={todo.priority}
                                onChange={(e) => updatePriority(todo.id, parseInt(e.target.value) || 0)}
                                className="w-16"
                                min="0"
                              />
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
              </div>
            )}

            <Link 
              href="/accounts"
              className="mt-6 inline-block rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
              Click here to view your accounts.
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}