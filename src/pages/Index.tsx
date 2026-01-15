import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved';
  votes: number;
  location: string;
  imageUrl?: string;
  date: string;
}

const Index = () => {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: 'Разбитый асфальт на ул. Ленина',
      description: 'Большие ямы на дороге, опасно для автомобилей и пешеходов',
      category: 'Дороги',
      status: 'in-progress',
      votes: 124,
      location: 'ул. Ленина, 45',
      date: '2026-01-10'
    },
    {
      id: 2,
      title: 'Нет освещения в парке',
      description: 'Темные аллеи парка создают небезопасную обстановку вечером',
      category: 'Освещение',
      status: 'pending',
      votes: 89,
      location: 'Центральный парк',
      date: '2026-01-12'
    },
    {
      id: 3,
      title: 'Нужны скамейки на детской площадке',
      description: 'Родителям негде посидеть, пока дети играют',
      category: 'Благоустройство',
      status: 'resolved',
      votes: 67,
      location: 'ул. Мира, двор 12',
      date: '2026-01-08'
    },
    {
      id: 4,
      title: 'Отсутствие урн возле магазина',
      description: 'Люди оставляют мусор на тротуаре',
      category: 'Чистота',
      status: 'pending',
      votes: 45,
      location: 'пр. Победы, 78',
      date: '2026-01-13'
    }
  ]);

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    category: '',
    location: ''
  });

  const handleVote = (id: number) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, votes: issue.votes + 1 } : issue
    ));
    toast.success('Ваш голос учтён!');
  };

  const handleSubmitIssue = () => {
    if (!newIssue.title || !newIssue.description || !newIssue.location) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const issue: Issue = {
      id: issues.length + 1,
      title: newIssue.title,
      description: newIssue.description,
      category: newIssue.category || 'Общее',
      status: 'pending',
      votes: 0,
      location: newIssue.location,
      date: new Date().toISOString().split('T')[0]
    };

    setIssues([issue, ...issues]);
    setNewIssue({ title: '', description: '', category: '', location: '' });
    toast.success('Предложение успешно отправлено!');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'На рассмотрении' },
      'in-progress': { color: 'bg-blue-100 text-blue-800', label: 'В работе' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Решено' }
    };
    return variants[status] || variants.pending;
  };

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    pending: issues.filter(i => i.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <Icon name="MapPin" className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  ГородПлюс
                </h1>
                <p className="text-xs text-gray-500">Вместе улучшаем наш город</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить предложение
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Новое предложение</DialogTitle>
                  <DialogDescription>
                    Опишите проблему или предложение по улучшению городского пространства
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Название проблемы *</Label>
                    <Input
                      id="title"
                      placeholder="Краткое описание проблемы"
                      value={newIssue.title}
                      onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Местоположение *</Label>
                    <Input
                      id="location"
                      placeholder="Улица, номер дома или название объекта"
                      value={newIssue.location}
                      onChange={(e) => setNewIssue({ ...newIssue, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Категория</Label>
                    <Input
                      id="category"
                      placeholder="Дороги, Освещение, Благоустройство..."
                      value={newIssue.category}
                      onChange={(e) => setNewIssue({ ...newIssue, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Подробное описание *</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишите проблему подробнее..."
                      rows={4}
                      value={newIssue.description}
                      onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmitIssue}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    Отправить предложение
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8 animate-fade-in">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Всего предложений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="FileText" className="text-green-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">В работе</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="Clock" className="text-blue-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.inProgress}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Решено</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-emerald-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.resolved}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Эффективность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round((stats.resolved / stats.total) * 100)}%
                  </span>
                </div>
                <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="all">
              <Icon name="LayoutGrid" size={16} className="mr-2" />
              Все предложения
            </TabsTrigger>
            <TabsTrigger value="map">
              <Icon name="Map" size={16} className="mr-2" />
              Карта города
            </TabsTrigger>
            <TabsTrigger value="profile">
              <Icon name="User" size={16} className="mr-2" />
              Мои предложения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 animate-slide-up">
            {issues.map((issue, index) => (
              <Card 
                key={issue.id} 
                className="bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all border-l-4 border-l-green-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusBadge(issue.status).color}>
                          {getStatusBadge(issue.status).label}
                        </Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{issue.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Icon name="MapPin" size={14} className="text-green-600" />
                        {issue.location}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-green-50"
                      onClick={() => handleVote(issue.id)}
                    >
                      <Icon name="ThumbsUp" size={16} className="text-green-600" />
                      <span className="font-semibold">{issue.votes}</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{issue.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {new Date(issue.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    {issue.status === 'resolved' && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <Icon name="Sparkles" size={14} />
                        Проблема решена!
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="map" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center z-10">
                    <Icon name="Map" size={64} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Интерактивная карта города
                    </h3>
                    <p className="text-gray-600">
                      Здесь будет отображаться карта с проблемными местами
                    </p>
                    <Button className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      <Icon name="Navigation" size={18} className="mr-2" />
                      Открыть карту
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Ваши предложения</CardTitle>
                <CardDescription>
                  История ваших предложений и их статус
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.slice(0, 2).map((issue) => (
                    <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{issue.location}</p>
                      </div>
                      <Badge className={getStatusBadge(issue.status).color}>
                        {getStatusBadge(issue.status).label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">О проекте</h3>
              <p className="text-sm text-gray-600">
                ГородПлюс — платформа для улучшения городских пространств с помощью ИИ
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Контакты</h3>
              <p className="text-sm text-gray-600">
                Email: admin@gorodplus.ru<br />
                Телефон: +7 (800) 123-45-67
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Социальные сети</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" className="hover:bg-green-50">
                  <Icon name="Share2" size={18} />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-blue-50">
                  <Icon name="MessageCircle" size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
