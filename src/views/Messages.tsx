import { markMessageAsRead } from '@/lib/messages';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from '@/lib/router-compat';
import { useConversation } from '@/hooks/useConversation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, Image, FileText, Video, Paperclip, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/lib/supabase';

const Messages = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversation');
  const artistId = searchParams.get('artistId'); // Add this line
  const artistName = searchParams.get('artistName'); // Add this line
  
    // Update the destructured values from useConversation to include the state setters
    const {
      conversations,
      messages,
      selectedConversationId,
      selectedUserName,
      loading,
      sending,
      startConversation,
      sendMessage,
      setSelectedConversationId,
      setSelectedUserName, // Add this
      setConversations, // Add this
    } = useConversation();
  
   
    // Effect to handle conversation initialization
  useEffect(() => {
    if (!user) return;
    
    const initializeConversation = async () => {
      if (artistId && artistName) {
        // Start or find existing conversation with the artist
        await startConversation(artistId, artistName);
      } else if (conversationIdFromUrl) {
        // Find the conversation in the list
        const conversation = conversations.find(conv => conv.id === conversationIdFromUrl);
        if (conversation) {
          setSelectedConversationId(conversationIdFromUrl);
          setSelectedUserName(conversation.conversation_with_name);
        }
      }
    };

    initializeConversation();
  }, [user, artistId, artistName, conversationIdFromUrl, conversations]);

  // Get the selected conversation details
  // In the conversations mapping section
  conversations.map((conv) => (
    <button
      key={conv.id}
      onClick={() => {
        setSelectedConversationId(conv.id);
        setSelectedUserName(conv.conversation_with_name);
      }}
      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3 ${
        selectedConversationId === conv.id ? 'bg-gray-100' : ''
      }`}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={conv.profile_image} />
        <AvatarFallback>
          <User className="h-6 w-6 text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800">{conv.conversation_with_name}</p>
        <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
        <p className="text-xs text-gray-400">
          {new Date(conv.updated_at).toLocaleDateString()}
        </p>
      </div>
    </button>
  ))
  
  // And update the selectedConversation finder
  const selectedConversation = conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Effect to update selected user name when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const fetchConversationDetails = async () => {
        const { data: convData, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', selectedConversationId)
          .single();
        
        if (convData && !error) {
          const otherUserName = convData.user1_id === user?.id ? convData.user2_name : convData.user1_name;
          const otherUserImage = convData.user1_id === user?.id ? convData.user2_profile_image : convData.user1_profile_image;
          const otherUserId = convData.user1_id === user?.id ? convData.user2_id : convData.user1_id;
          
          setSelectedUserName(otherUserName);
          // Update the conversation in the list with the correct details
          setConversations(prevConvs => prevConvs.map(conv => 
            conv.id === selectedConversationId  // Change this to match by conversation id
              ? {
                  ...conv,
                  conversation_with_id: otherUserId,
                  conversation_with_name: otherUserName,
                  profile_image: otherUserImage
                }
              : conv
          ));
        }
      };
      
      
      fetchConversationDetails();
    }
  }, 
  

  [selectedConversationId, user?.id]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (!messages || !user) return;
  
    const markUnreadMessages = async () => {
      const unread = messages.filter(
        (msg) => !msg.is_read && msg.recipient_id === user.id
      );
  
      for (const msg of unread) {
        await markMessageAsRead(msg.id, user.id);
      }
    };
  
    markUnreadMessages();
  }, [messages, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    try {
      await sendMessage(newMessage, selectedFile);
      setNewMessage('');
      setSelectedFile(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    // Convert HTTP to HTTPS if needed
    const secureUrl = imageUrl.replace('http://', 'https://');
    setSelectedImage(secureUrl);
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      // Convert HTTP to HTTPS if needed
      const secureUrl = imageUrl.replace('http://', 'https://');
      const response = await fetch(secureUrl);
      const blob = await response.blob();
      
      // Check if the blob is JSON
      if (blob.type === 'application/json') {
        // Handle JSON blob
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            // Handle the JSON data appropriately
            console.log('JSON data received:', jsonData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(blob);
        return;
      }
      
      // Continue with normal image download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.${blob.type.split('/')[1]}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const getMediaIcon = (mediaUrl: string) => {
    const extension = mediaUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-4 w-4 text-gray-500" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'webm':
        return <Video className="h-4 w-4 text-gray-500" />;
      default:
        return <Image className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Conversations List - Hide on mobile when conversation is selected */}
          <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 ${selectedConversationId ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            </div>
            <ScrollArea className="h-full">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-swati-purple mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              ) : (
                // In the conversations mapping section, use a combination of IDs to ensure uniqueness
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      setSelectedUserName(conv.conversation_with_name);
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-3 ${
                      selectedConversationId === conv.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.profile_image} />
                      <AvatarFallback>
                        <User className="h-6 w-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800">{conv.conversation_with_name}</p>
                      <p className="text-sm text-gray-500 truncate">{conv.last_message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Messages Area - Full screen on mobile when conversation is selected */}
          <div className={`flex-1 flex flex-col bg-gray-50 h-[calc(100vh-400px)] md:h-auto ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
            {selectedConversationId ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedConversation?.profile_image} />
                    <AvatarFallback>
                      <User className="h-6 w-6 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedUserName}</h3>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isFirstMessage = index === 0 || 
                        messages[index - 1].sender_id !== message.sender_id;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_id === user.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className="flex items-end gap-3 max-w-[80%]">
                            {message.sender_id !== user.id && isFirstMessage && (
                              <Avatar className="h-10 w-10">
                                <AvatarImage 
                                  src={message.sender_profile_image || selectedConversation?.profile_image} 
                                  alt={message.sender_name}
                                />
                                <AvatarFallback>
                                  {message.sender_name?.[0]?.toUpperCase() || <User className="h-5 w-5 text-gray-400" />}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`w-full p-4 rounded-lg ${
                                message.sender_id === user.id
                                  ? 'bg-swati-purple text-white rounded-br-none'
                                  : 'bg-white shadow-sm rounded-bl-none'
                              }`}
                            >
                              {message.media_url && (
                                <div className="mb-3 rounded-lg overflow-hidden cursor-pointer group relative">
                                  {message.media_url.toLowerCase().endsWith('.pdf') ? (
                                    // PDF preview
                                    <div 
                                      className="p-4 bg-gray-100 rounded flex items-center gap-2"
                                      onClick={() => window.open(message.media_url, '_blank')}
                                    >
                                      <FileText className="h-6 w-6 text-gray-600" />
                                      <span className="text-sm text-gray-600">PDF Document</span>
                                    </div>
                                  ) : message.media_url.match(/\.(mp4|mov|avi|webm)$/i) ? (
                                    // Video preview
                                    <video 
                                      controls
                                      className="max-w-full h-auto"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <source src={message.media_url} type={`video/${message.media_url.split('.').pop()}`} />
                                      Your browser does not support the video tag.
                                    </video>
                                  ) : (
                                    // Image preview
                                    <img 
                                      src={message.media_url} 
                                      alt="Shared media" 
                                      className="max-w-full h-auto"
                                      onClick={() => handleImageClick(message.media_url!)}
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-white hover:text-white hover:bg-black/50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload(message.media_url!);
                                      }}
                                    >
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              )}
                              <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={sending}
                    />
                    <Button 
                      type="submit" 
                      disabled={sending || (!newMessage.trim() && !selectedFile)}
                      className="bg-swati-purple hover:bg-swati-purple/90 w-10 h-10 p-0"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                      {getMediaIcon(selectedFile.name)}
                      <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                        className="ml-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg">Select a conversation to start messaging</p>
                  <p className="text-sm mt-2">Your messages will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {/* Image Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-[90vw] max-h-[90vh] relative">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:text-white hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage);
              }}
            >
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
