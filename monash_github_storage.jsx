import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  LayoutDashboard, 
  ListTodo,
  TrendingUp,
  Settings2,
  Check,
  ChevronRight,
  Database,
  Github,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// --- 常量配置 ---
const COURSES_DATA = [
  { id: 'c1', name: '9131 Java', color: 'bg-[#FCE7F3]', borderColor: 'border-pink-200', textColor: 'text-pink-500', iconColor: 'bg-pink-400', barColor: '#ec4899' }, 
  { id: 'c2', name: '9132 数据库', color: 'bg-[#E0F2FE]', borderColor: 'border-blue-200', textColor: 'text-blue-500', iconColor: 'bg-blue-400', barColor: '#3b82f6' },
  { id: 'c3', name: '9136 Python', color: 'bg-[#FEF9C3]', borderColor: 'border-yellow-200', textColor: 'text-yellow-600', iconColor: 'bg-yellow-400', barColor: '#ca8a04' },
  { id: 'c4', name: '9137 导论', color: 'bg-[#DCFCE7]', borderColor: 'border-green-200', textColor: 'text-green-500', iconColor: 'bg-green-400', barColor: '#22c55e' }
];

// --- 子任务项组件 ---
const SubtaskItem = ({ st, onUpdate, onDelete }) => {
  const [localTitle, setLocalTitle] = useState(st.title);
  const [localTime, setLocalTime] = useState(st.estimatedTime);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setLocalTitle(st.title);
    setLocalTime(st.estimatedTime);
    setIsChanged(false);
  }, [st.title, st.estimatedTime]);

  const handleBlur = () => {
    if (isChanged) {
      onUpdate(st.id, { title: localTitle, estimatedTime: Number(localTime) });
      setIsChanged(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 group shadow-sm">
      <input 
        className="text-[11px] text-slate-600 bg-transparent focus:outline-none flex-grow font-medium"
        value={localTitle}
        onChange={(e) => { setLocalTitle(e.target.value); setIsChanged(true); }}
        onBlur={handleBlur}
      />
      <div className="flex items-center gap-1">
        <input 
          type="number"
          step="0.25"
          className="w-10 text-right text-[10px] font-black text-slate-400 bg-transparent focus:outline-none"
          value={localTime}
          onChange={(e) => { setLocalTime(e.target.value); setIsChanged(true); }}
          onBlur={handleBlur}
        />
        <span className="text-[9px] text-slate-300 font-bold">h</span>
      </div>
      <button onClick={() => onDelete(st.id)} className="p-1 text-slate-200 hover:text-red-400 transition-colors">
        <Trash2 size={11} />
      </button>
    </div>
  );
};

// --- TaskCard 组件 ---
const TaskCard = ({ task, courseTextColor, allSubtasks, onUpdateTask, onDeleteTask, onAddSubtask, onUpdateSubtask, onDeleteSubtask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localTime, setLocalTime] = useState(task.estimatedTime);
  const [localDeadline, setLocalDeadline] = useState(task.deadline);
  
  const taskSubtasks = allSubtasks.filter(st => st.taskId === task.id);
  const hasSubtasks = taskSubtasks.length > 0;
  const calculatedTime = hasSubtasks 
    ? taskSubtasks.reduce((acc, curr) => acc + (Number(curr.estimatedTime) || 0), 0)
    : Number(localTime);

  useEffect(() => {
    if (!isEditing) {
      setLocalTitle(task.title);
      setLocalTime(task.estimatedTime);
      setLocalDeadline(task.deadline);
    }
  }, [task, isEditing]);

  const handleSave = () => {
    onUpdateTask(task.id, { title: localTitle, estimatedTime: Number(localTime), deadline: localDeadline });
    setIsEditing(false);
  };

  return (
    <div className={`border border-slate-100 rounded-xl transition-all ${isEditing ? 'bg-white ring-4 ring-slate-50 p-4 shadow-xl z-10 relative' : 'bg-slate-50/50 p-3 shadow-sm'}`}>
      <div className="flex items-center justify-between gap-3">
        {!isEditing ? (
          <div className="flex items-center gap-2 flex-grow overflow-hidden">
            <div className={`w-1 h-4 rounded-full ${courseTextColor.replace('text', 'bg')} opacity-40`} />
            <span className={`font-bold text-xs truncate ${courseTextColor}`}>{task.title}</span>
            <span className="text-[9px] font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100 shrink-0">{calculatedTime.toFixed(2)}h</span>
          </div>
        ) : (
          <input className={`bg-transparent font-bold focus:outline-none border-b border-slate-200 flex-grow text-xs py-1 ${courseTextColor}`} value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} autoFocus />
        )}
        <div className="flex items-center gap-1.5">
          {isEditing ? <button onClick={handleSave} className="p-1.5 rounded-lg bg-slate-900 text-white"><Check size={14} /></button> : <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg bg-white text-slate-400 border border-slate-100"><Settings2 size={13} /></button>}
        </div>
      </div>
      {isEditing && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">截止日期</label>
              <input type="date" className="w-full bg-slate-50 p-2 rounded-xl text-[10px] font-bold outline-none" value={localDeadline} onChange={(e) => setLocalDeadline(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase">预计时间</label>
              <input type="number" step="0.25" disabled={hasSubtasks} className="w-full bg-slate-50 p-2 rounded-xl text-[10px] font-bold outline-none" value={hasSubtasks ? calculatedTime.toFixed(2) : localTime} onChange={(e) => setLocalTime(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2 border-t pt-3">
            {taskSubtasks.map(st => <SubtaskItem key={st.id} st={st} onUpdate={onUpdateSubtask} onDelete={onDeleteSubtask} />)}
            <div className="flex gap-2">
              <button onClick={() => onAddSubtask(task.id)} className="flex-grow py-2 rounded-xl border border-dashed text-[9px] font-black text-slate-400 hover:bg-slate-50"><Plus size={12} className="inline mr-1" />添加环节</button>
              <button onClick={() => onDeleteTask(task.id)} className="px-3 rounded-xl bg-red-50 text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState('courses');
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState(() => JSON.parse(localStorage.getItem('gh_config') || '{"token":"","owner":"","repo":"","path":"data.json"}'));
  const [dbState, setDbState] = useState({ tasks: [], subtasks: [], dailyRecords: [], sha: null });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // --- GitHub API Logic ---
  const syncWithGithub = async (dataToSave = null) => {
    if (!config.token || !config.owner || !config.repo) return;
    setLoading(true);
    const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
    const headers = { Authorization: `token ${config.token}`, Accept: 'application/vnd.github.v3+json' };

    try {
      if (dataToSave) {
        const content = btoa(unescape(encodeURIComponent(JSON.stringify({
          tasks: dataToSave.tasks,
          subtasks: dataToSave.subtasks,
          dailyRecords: dataToSave.dailyRecords
        }, null, 2))));
        
        await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ message: 'Sync Task Data', content, sha: dbState.sha })
        });
        syncWithGithub();
      } else {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const json = await res.json();
          const decoded = JSON.parse(decodeURIComponent(escape(atob(json.content))));
          setDbState({ ...decoded, sha: json.sha });
        } else if (res.status === 404) {
          setDbState({ tasks: [], subtasks: [], dailyRecords: [], sha: null });
        }
      }
    } catch (e) {
      console.error("GitHub Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { syncWithGithub(); }, []);

  const saveConfig = () => {
    localStorage.setItem('gh_config', JSON.stringify(config));
    syncWithGithub();
    setShowConfig(false); // 保存后自动关闭
  };

  const updateDb = (newParts) => {
    const newState = { ...dbState, ...newParts };
    setDbState(newState);
    syncWithGithub(newState);
  };

  // --- 逻辑计算 ---
  const courseStats = useMemo(() => {
    return COURSES_DATA.map(course => {
      const cTasks = dbState.tasks.filter(t => t.courseId === course.id);
      const totalTime = cTasks.reduce((acc, t) => {
        const sts = dbState.subtasks.filter(st => st.taskId === t.id);
        return acc + (sts.length > 0 ? sts.reduce((sAcc, s) => sAcc + s.estimatedTime, 0) : t.estimatedTime);
      }, 0);
      return { ...course, totalTime };
    });
  }, [dbState]);

  const globalTotalTime = courseStats.reduce((acc, c) => acc + c.totalTime, 0);
  const todaysRecords = dbState.dailyRecords.filter(r => r.date === selectedDate);
  const remainingTime = todaysRecords.filter(r => !r.completed).reduce((acc, r) => acc + r.snapshotTime, 0);
  const completionRate = todaysRecords.length > 0 ? Math.round((todaysRecords.filter(r => r.completed).length / todaysRecords.length) * 100) : 0;

  // --- 数据操作 ---
  const addTask = (courseId) => {
    const newTask = { id: Date.now().toString(), courseId, title: '新任务', deadline: '', estimatedTime: 1.0, createdAt: Date.now() };
    updateDb({ tasks: [...dbState.tasks, newTask] });
  };
  const updateTask = (id, data) => updateDb({ tasks: dbState.tasks.map(t => t.id === id ? { ...t, ...data } : t) });
  const deleteTask = (id) => updateDb({ tasks: dbState.tasks.filter(t => t.id !== id), subtasks: dbState.subtasks.filter(st => st.taskId !== id) });
  const addSubtask = (taskId) => {
    const newSt = { id: Date.now().toString(), taskId, title: '新环节', estimatedTime: 0.25 };
    updateDb({ subtasks: [...dbState.subtasks, newSt] });
  };
  const updateSubtask = (id, data) => updateDb({ subtasks: dbState.subtasks.map(st => st.id === id ? { ...st, ...data } : st) });
  const deleteSubtask = (id) => updateDb({ subtasks: dbState.subtasks.filter(st => st.id !== id) });

  const toggleDaily = (targetId, type) => {
    const recordId = `${selectedDate}_${targetId}`;
    if (dbState.dailyRecords.some(r => r.id === recordId)) {
      updateDb({ dailyRecords: dbState.dailyRecords.filter(r => r.id !== recordId) });
    } else {
      let snapTitle = "未知", snapCourse = "未知", snapTime = 0;
      if (type === 'task') {
        const t = dbState.tasks.find(i => i.id === targetId);
        if (t) {
          snapTitle = t.title;
          snapCourse = COURSES_DATA.find(c => c.id === t.courseId)?.name || "未知";
          const sts = dbState.subtasks.filter(st => st.taskId === t.id);
          snapTime = sts.length > 0 ? sts.reduce((a, b) => a + b.estimatedTime, 0) : t.estimatedTime;
        }
      } else {
        const st = dbState.subtasks.find(i => i.id === targetId);
        if (st) {
          snapTitle = st.title;
          const pt = dbState.tasks.find(p => p.id === st.taskId);
          snapCourse = (COURSES_DATA.find(c => c.id === pt?.courseId)?.name || "未知") + " (环节)";
          snapTime = st.estimatedTime;
        }
      }
      updateDb({ dailyRecords: [...dbState.dailyRecords, { id: recordId, date: selectedDate, targetId, type, completed: false, snapshotTitle: snapTitle, snapshotCourse: snapCourse, snapshotTime: snapTime }] });
    }
  };

  const completeDaily = (record) => {
    const isNowDone = !record.completed;
    const newRecords = dbState.dailyRecords.map(r => r.id === record.id ? { ...r, completed: isNowDone } : r);
    if (isNowDone) {
      if (record.type === 'task') {
        updateDb({ dailyRecords: newRecords, tasks: dbState.tasks.filter(t => t.id !== record.targetId), subtasks: dbState.subtasks.filter(st => st.taskId !== record.targetId) });
      } else {
        updateDb({ dailyRecords: newRecords, subtasks: dbState.subtasks.filter(st => st.id !== record.targetId) });
      }
    } else {
      updateDb({ dailyRecords: newRecords });
    }
  };

  // --- 视图渲染 ---
  const renderConfig = () => (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 z-50 ${showConfig ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="max-w-[1200px] mx-auto p-6 relative">
        <button onClick={() => setShowConfig(false)} className="absolute top-4 right-6 text-slate-300 hover:text-slate-600"><XCircle size={24} /></button>
        <div className="flex items-center gap-2 text-slate-800 font-black text-sm uppercase mb-4"><Database size={16} /> GitHub 数据库配置</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className="p-2 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1" placeholder="GitHub Token (PAT)" type="password" value={config.token} onChange={e => setConfig({...config, token: e.target.value})} />
          <input className="p-2 bg-slate-50 rounded-lg text-xs outline-none" placeholder="用户名 (Owner)" value={config.owner} onChange={e => setConfig({...config, owner: e.target.value})} />
          <input className="p-2 bg-slate-50 rounded-lg text-xs outline-none" placeholder="仓库名 (Repo)" value={config.repo} onChange={e => setConfig({...config, repo: e.target.value})} />
          <button onClick={saveConfig} className="bg-slate-900 text-white rounded-lg text-xs font-bold py-2 flex items-center justify-center gap-2">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 保存并同步
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">数据将存储在仓库的 <b>{config.path}</b> 中。首次使用请确保仓库已创建。</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FBFDFF] text-slate-600 font-sans p-6 md:p-10 max-w-[1200px] mx-auto pb-32">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"><Github className="text-slate-400" size={24} /></div>
          <div><h1 className="text-2xl font-black text-slate-900">Monash 把我毁了</h1><p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">GitHub DB Edition</p></div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="bg-slate-100/50 p-1.5 rounded-xl border border-slate-100 flex gap-1">
            <button onClick={() => setView('courses')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${view === 'courses' ? 'bg-white text-slate-800 shadow-sm border' : 'text-slate-300'}`}>课程库</button>
            <button onClick={() => setView('daily')} className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${view === 'daily' ? 'bg-white text-slate-800 shadow-sm border' : 'text-slate-300'}`}>今日</button>
          </nav>
          <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-xl border transition-all ${showConfig ? 'bg-slate-800 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`} title="数据库设置">
            <Database size={20} />
          </button>
        </div>
      </header>

      <main className="mb-20">
        {view === 'courses' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {COURSES_DATA.map(course => (
                <div key={course.id} className={`bg-white rounded-2xl border-t-[6px] ${course.borderColor} shadow-lg shadow-slate-100/50 p-6 flex flex-col h-[400px]`}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className={`font-black text-sm flex items-center gap-2 ${course.textColor}`}><div className={`w-2 h-2 rounded-full ${course.iconColor}`} />{course.name}</h4>
                    <button onClick={() => addTask(course.id)} className={`p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 ${course.textColor}`}><Plus size={16} /></button>
                  </div>
                  <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                    {dbState.tasks.filter(t => t.courseId === course.id).map(task => (
                      <TaskCard key={task.id} task={task} courseTextColor={course.textColor} allSubtasks={dbState.subtasks} onUpdateTask={updateTask} onDeleteTask={deleteTask} onAddSubtask={addSubtask} onUpdateSubtask={updateSubtask} onDeleteSubtask={deleteSubtask} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-50 shadow-xl flex flex-col md:flex-row gap-8 justify-between items-center">
              <div><p className="text-slate-400 text-[10px] font-black mb-1">预计学业总负荷</p><h2 className="text-5xl font-black text-slate-900">{globalTotalTime.toFixed(2)} <span className="text-xl text-slate-200">h</span></h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                {courseStats.map(c => <div key={c.id} className="bg-slate-50 p-3 rounded-2xl text-center"><p className="text-[9px] font-black text-slate-300 mb-1">{c.name}</p><p className={`text-lg font-black ${c.textColor}`}>{c.totalTime.toFixed(2)}</p></div>)}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right duration-500 space-y-8 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-[300px] shrink-0 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 space-y-4">
                <p className="text-[10px] font-black text-slate-300 uppercase"><Calendar size={12} className="inline mr-1"/>目标日期</p>
                <input type="date" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-black outline-none" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <p className="text-[9px] text-slate-400 font-black mb-1">完成度</p><p className="text-3xl font-black">{completionRate}%</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-emerald-400 h-full transition-all duration-500" style={{width:`${completionRate}%`}} /></div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center"><p className="text-[9px] text-slate-300 font-black mb-1">今日待办</p><p className="text-3xl font-black text-slate-800">{remainingTime.toFixed(2)}h</p></div>
              </div>
            </div>
            <div className="flex-grow space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-sm"><ListTodo size={18} /> 执行清单</h3>
                <div className="space-y-3">
                  {todaysRecords.map(r => (
                    <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${r.completed ? 'opacity-30 grayscale bg-slate-50 border-transparent' : 'bg-white border-slate-50 shadow-sm'}`}>
                      <button onClick={() => completeDaily(r)} className="text-slate-300">{r.completed ? <CheckCircle2 size={24} className="text-emerald-400" /> : <Circle size={24} />}</button>
                      <div className="flex-grow"><p className={`text-sm font-black ${r.completed ? 'line-through' : 'text-slate-800'}`}>{r.snapshotTitle}</p><p className="text-[9px] font-black uppercase text-slate-400">{r.snapshotCourse}</p></div>
                      <div className="text-right"><p className="text-xs font-black text-slate-500">{r.snapshotTime.toFixed(2)}h</p><button onClick={() => toggleDaily(r.targetId, r.type)} className="text-[9px] text-red-300 mt-1 font-black">移除</button></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50/50 p-8 rounded-3xl border border-dashed space-y-6">
                 <div><h4 className="text-[10px] font-black text-slate-300 uppercase mb-4 tracking-[0.2em]">主任务库</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {dbState.tasks.map(t => {
                     const isAdded = dbState.dailyRecords.some(r => r.id === `${selectedDate}_${t.id}`);
                     return <div key={t.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center"><div className="overflow-hidden"><p className="text-[10px] font-black text-slate-400">{COURSES_DATA.find(c => c.id === t.courseId)?.name}</p><p className="text-xs font-bold truncate">{t.title}</p></div><button onClick={() => toggleDaily(t.id, 'task')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${isAdded ? 'bg-slate-50 text-slate-200' : 'bg-slate-900 text-white'}`}>{isAdded ? '已加' : '加入'}</button></div>
                   })}
                 </div></div>
                 <div className="border-t pt-6"><h4 className="text-[10px] font-black text-slate-300 uppercase mb-4 tracking-[0.2em]">细分环节库</h4><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {dbState.subtasks.map(st => {
                     const isAdded = dbState.dailyRecords.some(r => r.id === `${selectedDate}_${st.id}`);
                     const p = dbState.tasks.find(i => i.id === st.taskId);
                     return <div key={st.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center"><div><p className="text-[10px] font-black text-slate-400">{COURSES_DATA.find(c => c.id === p?.courseId)?.name}</p><p className="text-xs font-bold">{st.title}</p></div><button onClick={() => toggleDaily(st.id, 'subtask')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${isAdded ? 'bg-slate-50 text-slate-200' : 'bg-pink-500 text-white'}`}>{isAdded ? '已加' : '加入'}</button></div>
                   })}
                 </div></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 数据库配置面板 */}
      {renderConfig()}

      <footer className="py-10 border-t border-slate-50 text-center"><p className="text-slate-200 text-[10px] font-black tracking-[0.4em] uppercase">Destroyed by Monash | GitHub Sync Protocol</p></footer>
    </div>
  );
}

// 辅助组件：关闭图标
const XCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
