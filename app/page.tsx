'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from './components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Pencil, Check, X } from 'lucide-react';

type Note = string;

// Default notes if nothing in localStorage
const defaultNotes: Note[] = [
  'set the access token as a cookie so it can be used in the api calls instead of resetting the token every time',
  'fix price history card.',
  'update theme colors in globals.css. Looks as shad ui them page for reference, instead of hardcoding blue buttons',
  'connect supabase to the app. Use it for the account data',
  'set up refresh token rotation',
  'On the R/R card, add the % gain and loss that the PT and SL are from the entry price',
  'add revennue data and percent change from each earnings to the ticker page',
  'Add stage analysis to the ticker page',
  'Cache the getPositions and getTickers calls?',
  'Fix all table footers, if not data in suspense then table says page 1 of 0',
  'Remove NaN from ticker page id web service calls fails',
  'Add ADR and other stuff to Ticker page',
  'Automate api keys',
  'Deployed on vercel'
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize notes from localStorage
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('appNotes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        if (Array.isArray(parsedNotes)) {
          setNotes(parsedNotes);
        } else {
          setNotes(defaultNotes);
        }
      } else {
        setNotes(defaultNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes(defaultNotes);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('appNotes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes:', error);
      }
    }
  }, [notes, isLoading]);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote(''); // Clear input after adding
    }
  };

  const deleteNote = (indexToRemove: number) => {
    setNotes(notes.filter((_, index) => index !== indexToRemove));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(notes[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const saveEdit = (index: number) => {
    if (editingText.trim()) {
      const updatedNotes = [...notes];
      updatedNotes[index] = editingText.trim();
      setNotes(updatedNotes);
    }
    setEditingIndex(null);
    setEditingText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (editingIndex !== null) {
        saveEdit(editingIndex);
      } else {
        addNote();
      }
    } else if (e.key === 'Escape' && editingIndex !== null) {
      cancelEditing();
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
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter a new note"
                className="w-full max-w-md"
              />
              <Button 
                onClick={addNote} 
                variant="outline" 
                size="icon"
                disabled={!newNote.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-6">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes yet. Add a new note!</p>
          ) : (
            <ul className="list-inside list-decimal text-left font-[family-name:var(--font-geist-mono)]"> 
              {notes.map((note, index) => (
                <li 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  {editingIndex === index ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button 
                          onClick={() => saveEdit(index)}
                          variant="ghost" 
                          size="icon"
                          className="text-green-500 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={cancelEditing}
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
                      <span className="flex-1">{note}</span>
                      <div className="flex gap-1">
                        <Button 
                          onClick={() => startEditing(index)}
                          variant="ghost" 
                          size="icon"
                          className="text-blue-500 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => deleteNote(index)} 
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