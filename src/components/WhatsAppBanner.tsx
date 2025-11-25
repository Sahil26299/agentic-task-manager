"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MessageCircle,
  Smartphone,
  QrCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ScanLine,
} from "lucide-react";

const WhatsAppBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mb-4 flex items-center justify-between bg-emerald-50 dark:bg-gray-900 hover:bg-emerald-100 dark:hover:bg-gray-900 text-emerald-700 dark:text-white px-4 py-3 rounded-xl border border-emerald-200 dark:border-gray-700 transition-all font-medium"
      >
        <div className="flex items-center gap-2">
          <ScanLine size={18} />
          <span className="text-sm">
            {isExpanded ? "Hide" : "Show"} WhatsApp Integration
          </span>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Collapsible Banner */}
      {isExpanded && (
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-4 sm:p-5 mb-8 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col lg:flex-row items-center gap-5">
            {/* Left side - Information */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <MessageCircle className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create Tasks via WhatsApp
                  </h2>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    Manage your tasks on the go! 💬
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Connect your WhatsApp to create, manage, and track tasks
                  directly from your phone.
                </p>

                {/* Two options */}
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {/* Option 1: Text the code */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-lg">
                        <Smartphone
                          className="text-emerald-600 dark:text-emerald-400"
                          size={16}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                          Option 1: Text to Join
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
                          Send this message to our Twilio number:
                        </p>
                        <a
                          href="http://wa.me/+14155238886?text=join%20powder-close"
                          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-300 dark:border-emerald-700 flex items-center justify-between"
                        >
                          join powder-close <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Scan QR */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-start gap-2">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 p-1.5 rounded-lg">
                        <QrCode
                          className="text-emerald-600 dark:text-emerald-400"
                          size={16}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                          Option 2: Scan QR Code →
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Use your phone camera to scan the QR code and join
                          instantly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3 border-l-4 border-emerald-500">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      💡 Pro Tip:
                    </strong>{" "}
                    Once connected, simply send a message like
                    <span className="font-mono text-sm mx-1 px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-emerald-300 dark:border-emerald-700">
                      "Buy groceries tomorrow at 2pm"
                    </span>
                    and we&apos;ll automatically create a task with a reminder!
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - QR Code */}
            <div className="shrink-0">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-3 shadow-xl border-2 border-emerald-200 dark:border-emerald-800">
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white text-center">
                    Scan to Connect
                  </p>
                  <div className="bg-white p-2 rounded-lg border-2 border-gray-200">
                    <Image
                      src="/images/textTwilioQR.svg"
                      alt="WhatsApp QR Code"
                      width={140}
                      height={140}
                      className=""
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center max-w-[120px]">
                    Open WhatsApp camera and point at this code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppBanner;
