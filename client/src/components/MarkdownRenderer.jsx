import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 mb-3 border-b border-slate-800 pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl sm:text-2xl font-bold text-white mt-5 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-white mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed text-slate-300 text-sm sm:text-base my-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-300 text-sm sm:text-base" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-300 text-sm sm:text-base" {...props} />,
          li: ({ node, ...props }) => <li className="text-slate-300" {...props} />,
          code: ({ inline, className, children, ...props }) => {
            return inline ? (
              <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className={`${className} font-mono text-xs sm:text-sm`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto my-4 text-xs sm:text-sm font-mono" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic text-slate-400 bg-slate-900/40 rounded-r my-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-indigo-400 hover:underline font-medium" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
